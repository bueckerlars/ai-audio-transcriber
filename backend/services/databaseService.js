const { Sequelize, Model, DataTypes, QueryTypes } = require('sequelize');
const fs = require("fs");
const LoggerService = require('./loggerService');
require('dotenv').config();

class DatabaseService {
    constructor() {
        this.sequelize = null;
        this.initialized = false;
        this.models = {};
        this.logger = new LoggerService('DB');
    }

    async initialize() {
        if (this.initialized) return;

        this.logger.info('Initializing database connection...');
        const dbType = process.env.DB_TYPE || 'sqlite';
        this.logger.debug("Database type: " + dbType);
        
        switch (dbType.toLowerCase()) {
            case 'sqlite':
                // Makes shure path exists
                const SQLITE_PATH = process.env.SQLITE_PATH || './database.sqlite';
                if (!fs.existsSync(SQLITE_PATH)) fs.mkdirSync(SQLITE_PATH, { recursive: true });

                this.sequelize = new Sequelize({
                    dialect: 'sqlite',
                    storage: process.env.SQLITE_PATH || './database.sqlite',
                    logging: false
                });
                break;

            case 'postgres':
                this.sequelize = new Sequelize({
                    dialect: 'postgres',
                    host: process.env.DB_HOST || 'localhost',
                    port: process.env.DB_PORT || 5432,
                    username: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                    logging: false
                });
                break;

            case 'mysql':
                this.sequelize = new Sequelize({
                    dialect: 'mysql',
                    host: process.env.DB_HOST || 'localhost',
                    port: process.env.DB_PORT || 3306,
                    username: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                    logging: false
                });
                break;

            default:
                throw new Error(`Unsupported database type: ${dbType}`);
        }

        // Modelle initialisieren
        this.models = {
            User: require('../models/User').init(this.sequelize),
            File: require('../models/File').init(this.sequelize)
        };

        try {
            await this.sequelize.authenticate();
            await this.sequelize.sync();
            this.logger.info('Database connection established successfully');
            this.initialized = true;
        } catch (error) {
            this.logger.error('Unable to connect to the database:', error);
            throw error;
        }
    }

    getInstance() {
        if (!this.initialized) {
            throw new Error('DatabaseService must be initialized first');
        }
        return this.sequelize;
    }

    async close() {
        if (this.sequelize) {
            await this.sequelize.close();
            this.initialized = false;
        }
    }

    // Grundlegende CRUD-Operationen
    async createTable(tableName, schema) {
        try {
            this.logger.debug(`Creating table: ${tableName}`);
            const model = this.sequelize.define(tableName, schema, {
                timestamps: true
            });
            await model.sync();
            this.logger.info(`Table ${tableName} created successfully`);
            return model;
        } catch (error) {
            this.logger.error(`Error creating table ${tableName}:`, error);
            throw error;
        }
    }

    async insert(tableName, data) {
        try {
            this.logger.debug(`Inserting into ${tableName}:`, data);
            const model = this.sequelize.model(tableName);
            const result = await model.create(data);
            this.logger.info(`Successfully inserted into ${tableName}`);
            return result;
        } catch (error) {
            this.logger.error(`Error inserting into ${tableName}:`, error);
            throw error;
        }
    }

    async bulkInsert(tableName, dataArray) {
        try {
            const model = this.sequelize.model(tableName);
            return await model.bulkCreate(dataArray);
        } catch (error) {
            console.error(`Error bulk inserting into ${tableName}:`, error);
            throw error;
        }
    }

    async findAll(tableName, options = {}) {
        try {
            const model = this.sequelize.model(tableName);
            return await model.findAll(options);
        } catch (error) {
            console.error(`Error querying ${tableName}:`, error);
            throw error;
        }
    }

    async findOne(tableName, options = {}) {
        try {
            const model = this.sequelize.model(tableName);
            return await model.findOne(options);
        } catch (error) {
            console.error(`Error querying ${tableName}:`, error);
            throw error;
        }
    }

    async update(tableName, data, where) {
        try {
            this.logger.debug(`Updating ${tableName}:`, { data, where });
            const model = this.sequelize.model(tableName);
            const result = await model.update(data, { where });
            this.logger.info(`Successfully updated ${tableName}`);
            return result;
        } catch (error) {
            this.logger.error(`Error updating ${tableName}:`, error);
            throw error;
        }
    }

    async delete(tableName, where) {
        try {
            this.logger.debug(`Deleting from ${tableName}:`, where);
            const model = this.sequelize.model(tableName);
            const result = await model.destroy({ where });
            this.logger.info(`Successfully deleted from ${tableName}`);
            return result;
        } catch (error) {
            this.logger.error(`Error deleting from ${tableName}:`, error);
            throw error;
        }
    }

    // Raw SQL Queries
    async query(sql, options = {}) {
        try {
            return await this.sequelize.query(sql, {
                type: QueryTypes.SELECT,
                ...options
            });
        } catch (error) {
            console.error('Error executing raw query:', error);
            throw error;
        }
    }

    // Transaktionen
    async transaction(callback) {
        try {
            return await this.sequelize.transaction(callback);
        } catch (error) {
            console.error('Error in transaction:', error);
            throw error;
        }
    }

    // Schema-Operationen
    async dropTable(tableName) {
        try {
            const model = this.sequelize.model(tableName);
            await model.drop();
            console.log(`Table ${tableName} dropped successfully`);
        } catch (error) {
            console.error(`Error dropping table ${tableName}:`, error);
            throw error;
        }
    }

    async truncateTable(tableName) {
        try {
            const model = this.sequelize.model(tableName);
            await model.truncate();
            console.log(`Table ${tableName} truncated successfully`);
        } catch (error) {
            console.error(`Error truncating table ${tableName}:`, error);
            throw error;
        }
    }

    // Hilfsmethode zum Zugriff auf Models
    getModel(modelName) {
        return this.models[modelName];
    }

    /**
     * Erstellt einen neuen Transkriptions-Job
     */
    async createTranscriptionJob(jobData) {
        const [job] = await this.sequelize.query('INSERT INTO transcription_jobs (status, created_at) VALUES (:status, :created_at) RETURNING *', {
            replacements: {
                status: jobData.status,
                created_at: jobData.created_at
            },
            type: QueryTypes.INSERT
        });
        return job;
    }

    /**
     * Aktualisiert den Status eines Transkriptions-Jobs
     */
    async updateTranscriptionStatus(jobId, updateData) {
        const [updated] = await this.sequelize.query('UPDATE transcription_jobs SET status = :status, updated_at = :updated_at, completed_at = :completed_at, transcript_path = :transcript_path, error = :error WHERE id = :id RETURNING *', {
            replacements: {
                status: updateData.status,
                updated_at: new Date(),
                completed_at: updateData.completed_at,
                transcript_path: updateData.transcript_path,
                error: updateData.error,
                id: jobId
            },
            type: QueryTypes.UPDATE
        });
        return updated;
    }

    /**
     * Holt einen Transkriptions-Job anhand seiner ID
     */
    async getTranscriptionJob(jobId) {
        const job = await this.sequelize.query('SELECT * FROM transcription_jobs WHERE id = :id', {
            replacements: { id: jobId },
            type: QueryTypes.SELECT
        });
        return job[0][0];
    }
}

// Singleton-Instanz exportieren
module.exports = new DatabaseService();
