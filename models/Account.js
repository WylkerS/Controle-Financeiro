const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Account = sequelize.define('Account', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, 
        },
        initialBalance: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0.0,
        }
        
    }, {
        tableName: 'Accounts',
        timestamps: true,
    });

    Account.associate = (models) => {
        Account.hasMany(models.Transaction, {
            foreignKey: 'accountId',
            as: 'transactions'
        });
    };

    return Account;
};