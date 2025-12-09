const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Category = sequelize.define('Category', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('INCOME', 'EXPENSE'), 
            allowNull: false,
            defaultValue: 'EXPENSE'
        }
    }, {
        tableName: 'Categories',
        timestamps: true,
    });

    Category.associate = (models) => {
        Category.hasMany(models.Transaction, { foreignKey: 'categoryId', as: 'transactions' });
    };

    return Category;
};