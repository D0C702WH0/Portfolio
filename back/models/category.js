'use strict';
module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {});
  category.associate = function(models) {
    models.category.belongsToMany(models.photo, {
      through:"category_photo",
      foreignKey: 'IdCategory'
    })
  };
  return category;
};