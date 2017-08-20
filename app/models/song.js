module.exports = function(sequelize, Sequelize) {

  var Song = sequelize.define('song', {

    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },

    songName: {
      type: Sequelize.STRING,
      notEmpty: true
    },

    artistName: {
      type: Sequelize.STRING,
      notEmpty: true
    },

    genre: {
      type: Sequelize.TEXT
    },

    clipLink: {
      type: Sequelize.TEXT
    }

  });

  return Song;
}
