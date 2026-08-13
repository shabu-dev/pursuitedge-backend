module.exports = (sequelize, Sequelize) => {
  const Course = sequelize.define(
    'course',
    {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },

      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'courses',
      timestamps: true,
    }
  );

  return Course;
};