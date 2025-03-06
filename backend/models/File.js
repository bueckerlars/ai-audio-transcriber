const { DataTypes } = require('sequelize');

class File {
  static init(sequelize) {
    return sequelize.define('File', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        }
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false
      },
      originalName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      mimeType: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  }
}

module.exports = File;