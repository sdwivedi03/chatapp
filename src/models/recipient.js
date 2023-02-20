const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Recipient extends Model {
    
    static associate() {
      // define association here
    }
  }
  Recipient.init(
    {
      userId: DataTypes.STRING,
      deliveredAt: DataTypes.DATE,
      seenAt: DataTypes.DATE,
      reaction: DataTypes.ENUM('like', 'dislike', 'sad', 'angry', 'heart', 'laugh'),
      reactedAt: DataTypes.DATE,

    },
    {
      sequelize,
      modelName: 'Recipient',
      //In case of deleted at it will delete only recipients message
      paranoid: true
    }
  );

  return Recipient;
};
