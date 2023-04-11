'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.entry.belongsTo(models.user)
      models.entry.belongsToMany(models.tag, { through: 'entry_tag'})
    }
  }
  entry.init({
    userId: DataTypes.INTEGER,
    content: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'entry',
  });
  return entry;
};