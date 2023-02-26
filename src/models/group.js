const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    
    static associate(models) {
      // define association here
      Group.hasMany(models.Participant);

      // Group.belongsToMany(models.User, {
      //   through: models.Participant,
      //   foreignKey: "groupId",
      //   as: "users"
      // });
    }
  }
  Group.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        autoIncrement: false,
      },
      name: DataTypes.STRING,
      createdBy: DataTypes.UUID
    },
    {
      sequelize,
      modelName: 'Group',
      paranoid: true,
    }
  );

  return Group;
};
