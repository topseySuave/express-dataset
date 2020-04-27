class RepoModel {
    constructor(db) {
        this.db = db
    }

    createTable() {
        const sql = `
        CREATE TABLE IF NOT EXISTS repos (
          id INTEGER,
          name TEXT,
          url TEXT)`
        return this.db.run(sql)
    }

    create(id, name, url) {
        return this.db.run(
            `INSERT INTO repos (id, name, url)
          VALUES (?, ?, ?)`, [id, name, url])
    }

    getOne(id) {
        return this.db.get('SELECT * FROM repos WHERE id = ?', [id]);
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

module.exports = RepoModel;