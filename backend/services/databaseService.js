const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');

class DatabaseService {
    constructor() {
        this.dbType = process.env.DB_TYPE || 'sqlite'; // Default is SQLite
        this.connection = null;
        this.init();
    }

    init() {
        if (this.dbType === 'sqlite') {
            const dbPath = path.join(__dirname, '..', 'data', 'database.sqlite');
            this.connection = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('Error connecting to SQLite database:', err);
                } else {
                    console.log('Successfully connected to SQLite');
                }
            });
        } else if (this.dbType === 'postgres') {
            this.connection = new Pool({
                user: process.env.DB_USER,
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                password: process.env.DB_PASSWORD,
                port: process.env.DB_PORT || 5432,
            });
        }
    }

    async query(sql, params = []) {
        return new Promise((resolve, reject) => {
            if (this.dbType === 'sqlite') {
                this.connection.all(sql, params, (err, rows) => {
                    if (err) reject(err);
                    resolve(rows);
                });
            } else if (this.dbType === 'postgres') {
                this.connection.query(sql, params)
                    .then(result => resolve(result.rows))
                    .catch(err => reject(err));
            }
        });
    }

    async execute(sql, params = []) {
        return new Promise((resolve, reject) => {
            if (this.dbType === 'sqlite') {
                this.connection.run(sql, params, function(err) {
                    if (err) reject(err);
                    resolve({ lastID: this.lastID, changes: this.changes });
                });
            } else if (this.dbType === 'postgres') {
                this.connection.query(sql, params)
                    .then(result => resolve({ 
                        lastID: result.rows[0]?.id, 
                        changes: result.rowCount 
                    }))
                    .catch(err => reject(err));
            }
        });
    }

    async close() {
        if (this.dbType === 'sqlite') {
            return new Promise((resolve, reject) => {
                this.connection.close((err) => {
                    if (err) reject(err);
                    resolve();
                });
            });
        } else if (this.dbType === 'postgres') {
            await this.connection.end();
        }
    }
}

// Export singleton instance
const databaseService = new DatabaseService();
module.exports = databaseService;
