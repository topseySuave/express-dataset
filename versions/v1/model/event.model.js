class EventModel {
    constructor(db) {
        this.db = db
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS events (
          id INTEGER,
          type TEXT,
          actor_id INTEGER,
          repo_id INTEGER,
          created_at TEXT,
          FOREIGN KEY (actor_id) REFERENCES actors(id),
          FOREIGN KEY (repo_id) REFERENCES repos(id))`
        return this.db.run(sql)
    }

    create(id, type, actorId, repoId, createdAt) {
        return this.db.run(
            `INSERT INTO events (id, type, actor_id, repo_id, created_at)
          VALUES (?, ?, ?, ?, ?)`, [id, type, actorId, repoId, createdAt])
    }

    getOne(id) {
        return this.db.get('SELECT * FROM events WHERE id = (?)', [id]);
    }

    getAll() {
        return this.db.all('SELECT * FROM events ORDER BY id ASC');
    }

    getEventsByActorsId(id) {
        return this.db.all('SELECT * FROM events WHERE actor_id = (?) ORDER BY id ASC', [id]);
    }

    erase() {
        return this.db.run(`DELETE FROM events`)
    }

    close() {
        this.db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    }
}

module.exports = EventModel;