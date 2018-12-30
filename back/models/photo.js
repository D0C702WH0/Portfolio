'use strict';
module.exports = (sequelize, DataTypes) => {
  const photo = sequelize.define('photo', {
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  photo.associate = function(models) {
    // associations can be defined here
    models.photo.belongsToMany(models.category, {
      through:"category_photo",
      foreignKey: 'Idcategory'
    })
  };
  return photo;
};