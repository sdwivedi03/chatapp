const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
 
    static associate(models) {
      // define association here
      Message.hasMany(models.Recipient);
    }
  }
  Message.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      isGroup: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      //It is message id of message that is used to reply
      //for the current message
      repliedFor: DataTypes.UUID
      // sentAt will automatic will create with timestamps
      // deletedAt will automatic will create with timestamps
    },
    {
      sequelize,
      modelName: 'Message',
      paranoid: true,      //Here deletedAt will be considered as deleted message for every one
      createdAt: 'sentAt'
    }
  );
  
  return Message;
};
