const { DataTypes } = require('sequelize');

class User {
    static init(sequelize) {
        return sequelize.define('User', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            profilePictureUrl: {
                type: DataTypes.STRING,
                allowNull: true
            },
        }, {
            tableName: 'Users'
        });
    }
}

module.exports = User;