const sqlite3 = require('sqlite3').verbose();
const EventsModel = require('./model/event.model')
const ActorsModel = require('./model/actors.model')
const ReposModel = require('./model/repos.model')
const DB_PATH = './database.db';

/**
 * Database Initialisation
 * @InitDB
 */
class InitDB {
    constructor() {
        this.db = new sqlite3.Database(DB_PATH, err => {
            if (err) {
                console.log(err)
                return
            }
            console.log('Connected to ' + DB_PATH + ' database.')
        });
    }

    /**
     * run a query on the database and return a success true value or error
     * @run
     * @param {string} sql - SQL query.
     * @param {array} params - array of query params
     */
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, (err) => {
                if (err) {
                    console.log("Error running sql " + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(1);
                }
            });
        });
    }

    /**
     * get list of records from database
     * @get
     * @param {string} sql - SQL query.
     * @param {array} params - array of query params
     */
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, rows) => {
                if (err) {
                    console.log("Error running sql: " + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    /**
     * all list of records from database
     * @all
     * @param {string} sql - SQL query.
     * @param {array} params - array of query params
     */
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log("Error running sql: " + sql);
                    console.log(err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

// init db
const db = new InitDB();

// inject db to all models
const eventsModel = new EventsModel(db);
const actorsModel = new ActorsModel(db);
const reposModel = new ReposModel(db);

module.exports = {
    eventsModel,
    actorsModel,
    reposModel
};