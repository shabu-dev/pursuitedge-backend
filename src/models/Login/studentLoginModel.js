module.exports = (sequelize, Sequelize) => {
  const studentLogin = sequelize.define(
    "student_login",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      password: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      designation: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      provider: {
        type: Sequelize.ENUM("local", "google", "linkedin"),
        allowNull: false,
        defaultValue: "local",
      },

      providerId: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      status: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: "1 = Active, 0 = Inactive",
      },
    },
    {
      tableName: "student_login",
      timestamps: true,
    }
  );

  return studentLogin;
};
