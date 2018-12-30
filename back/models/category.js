'use strict';
module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  category.associate = function(models) {
    models.category.belongsToMany(models.photo, {
      through:"category_photo",
      foreignKey: 'IdPhoto'
    })
  };
  return category;
};