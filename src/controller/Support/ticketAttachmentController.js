const fs = require("fs");
const path = require("path");
const ticketRepository = require("../../repository/Support/ticketRepository");
const attachmentRepository = require("../../repository/Support/ticketAttachmentRepository");
const messageRepository = require("../../repository/Support/ticketMessageRepository");
const historyRepository = require("../../repository/Support/ticketHistoryRepository");

const uploadAttachments = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user?.id;
		if (!userId) {
			return res.status(401).json({ success: false, message: "Unauthorized" });
		}
		// Check ticket
		const ticket = await ticketRepository.getTicketById(id);
		if (!ticket) {
			return res.status(404).json({ success: false, message: "Ticket not found" });
		}

		// Check files
		if (!req.files || req.files.length === 0) {
			return res.status(400).json({ success: false, message: "Please upload at least one file",});
		}

		/*
		 * Attachments belong to a message.
		 *
		 * If the upload is sent directly without
		 * a message, create an attachment message.
		 */

		const message = req.body.message || "Attachment uploaded";

		const ticketMessage = await messageRepository.createMessage({
			ticket_id: id,
			sender_id: userId,
			sender_type: req.body.sender_type || "DEVELOPER",
			message,
			message_type: req.body.message_type || "PUBLIC_MESSAGE",
		});

		const attachments = [];

		for (const file of req.files) {
			const attachment = await attachmentRepository.createAttachment({
				message_id: ticketMessage.id,
				original_name: file.originalname,
				stored_name: file.filename,
				mime_type: file.mimetype,
				file_size: file.size,
				file_path: file.path,
				uploaded_by: userId,
			});

			attachments.push(attachment);

            await historyRepository.createHistory({
				ticket_id: id,
				action: "ATTACHMENT_ADDED",
				old_value: null,
				new_value: file.originalname,
				performed_by: userId,
			});
		}

		return res.status(201).json({success: true, message: "Attachment uploaded successfully",ticketMessage,attachments,});
	} catch (error) {
		console.error("Upload attachment error:", error);
		/*
		 * If database insertion fails after files
		 * have already been uploaded, remove files.
		 */
		if (req.files) {
			for (const file of req.files) {
				try {
					if (fs.existsSync(file.path)) {
						fs.unlinkSync(file.path);
					}
				} catch (deleteError) {
					console.error("File cleanup error:", deleteError);
				}
			}
		}
		return res.status(500).json({success: false,message: error.message,});
	}
};

const downloadAttachment = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user?.id;
		const role = String(req.user?.role || "").toUpperCase();

		if (!userId) {
			return res.status(401).json({success: false, message: "Unauthorized",});
		}

		const attachment = await attachmentRepository.getAttachmentById(id);

		if (!attachment) {
			return res.status(404).json({success: false,message: "Attachment not found",});
		}

		/*
        |--------------------------------------------------------------------------
        | Get the message
        |--------------------------------------------------------------------------
        */

		const message = await messageRepository.getMessageById(attachment.message_id);

		if (!message) {
			return res.status(404).json({success: false,message: "Message not found",});
		}

		/*
        |--------------------------------------------------------------------------
        | Get ticket
        |--------------------------------------------------------------------------
        */

		const ticket = await ticketRepository.getTicketById(message.ticket_id);

		if (!ticket) {
			return res.status(404).json({ success: false, message: "Ticket not found",});
		}

		/*
        |--------------------------------------------------------------------------
        | Authorization
        |--------------------------------------------------------------------------
        */

		const isAdmin = role === "ADMIN";
		const isSupport = role === "SUPPORT";

		const isAssignedDeveloper =
			role === "DEVELOPER" && String(ticket.assigned_to) === String(userId);

		if (!isAdmin && !isSupport && !isAssignedDeveloper) {
			return res.status(403).json({
				success: false,
				message: "You do not have permission to access this attachment",
			});
		}

		/*
        |--------------------------------------------------------------------------
        | File
        |--------------------------------------------------------------------------
        */

		const fs = require("fs");

		if (!attachment.file_path || !fs.existsSync(attachment.file_path)) {
			return res.status(404).json({
				success: false,
				message: "File no longer exists",
			});
		}

		return res.download(attachment.file_path, attachment.original_name);
	} catch (error) {
		console.error("Download attachment error:", error);

		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

const deleteAttachment = async (req, res) => {
	try {
		const { id } = req.params;

		const attachment = await attachmentRepository.getAttachmentById(id);

		if (!attachment) {
			return res.status(404).json({
				success: false,

				message: "Attachment not found",
			});
		}

		// Delete physical file
		if (attachment.file_path && fs.existsSync(attachment.file_path)) {
			fs.unlinkSync(attachment.file_path);
		}

		await attachmentRepository.deleteAttachment(id);

		return res.status(200).json({
			success: true,

			message: "Attachment deleted successfully",
		});
	} catch (error) {
		console.error("Delete attachment error:", error);

		return res.status(500).json({
			success: false,

			message: error.message,
		});
	}
};

module.exports = {
	uploadAttachments,
	downloadAttachment,
	deleteAttachment,
};
