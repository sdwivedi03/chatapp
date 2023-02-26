/* eslint-disable no-param-reassign */
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Participant extends Model {
    
    // static associate() {
    //   // define association here
    // }
  }
  Participant.init(
    {
      // groupId: DataTypes.UUID,
      userId: DataTypes.UUID,
      addedBy: DataTypes.UUID
    },
    {
      sequelize,
      modelName: 'Participant',
      paranoid: true,
    }
  );

  return Participant;
};
