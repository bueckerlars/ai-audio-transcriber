const { DataTypes } = require('sequelize');

class TranscriptionJob {
  static init(sequelize) {
    return sequelize.define('TranscriptionJob', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE
      },
      completed_at: {
        type: DataTypes.DATE
      },
      transcript_file_id: {
        type: DataTypes.UUID,
        references: {
          model: 'Files', // Name of the target model
          key: 'id' // Key in the target model
        }
      },
      audio_file_id: {
        type: DataTypes.UUID,
        references: {
          model: 'Files', // Name of the target model
          key: 'id' // Key in the target model
        }
      },
      error: {
        type: DataTypes.STRING
      }
    }, {
      timestamps: false,
      tableName: 'transcription_jobs'
    });
  }
}

module.exports = TranscriptionJob;
