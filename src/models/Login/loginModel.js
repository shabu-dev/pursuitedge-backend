const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  const Login = sequelize.define('user', {
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role_id: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    
  },{
    timestamps: true
  });

  Login.beforeCreate(async (login) => {
    login.password = await bcrypt.hash(login.password, 10);
  });

  return Login;
};
