module.exports = function(sequelize, Sequelize) {

  var User = sequelize.define('user', {

    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    firstName: {
      type: Sequelize.STRING,
      notEmpty: true
    },

    lastName: {
      type: Sequelize.STRING,
      notEmpty: true
    },

    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true
      }
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false
    },

    screenName: {
      type: Sequelize.TEXT
    },

    scoreRunning: {
      type: Sequelize.INTEGER,
      notEmpty: true
    },

    scoreThisGame: {
      type: Sequelize.INTEGER,
      notEmpty: true
    },

    lastLogin: {
      type: Sequelize.DATE
    },

    status: {
      type: Sequelize.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }

  });

  return User;
}
