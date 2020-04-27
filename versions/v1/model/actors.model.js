/**
 * Actors Model
 * @ActorModel
 */
class ActorModel {
    constructor(db) {
        this.db = db
    }

    /**
     * Create actors table
     * @createTable
     */
    createTable() {
        const sql = `
      CREATE TABLE IF NOT EXISTS actors (
        id INTEGER,
        login TEXT,
        avatar_url TEXT)`
        return this.db.run(sql)
    }

    /**
     * Create actors table
     * @create
     * @param {number} id - integer id for an actor.
     * @param {array} login - login string for an actor
     * @param {string} avatarUrl - avatar url
     */
    create(id, login, avatarUrl) {
        return this.db.run(
            'INSERT INTO actors (id, login, avatar_url) VALUES (?, ?, ?)', [id, login, avatarUrl])
    }

    /**
     * Get One
     * @getOne
     * @param {number} id - integer id for an actor.
     */
    getOne(id) {
        return this.db.get('SELECT * FROM actors WHERE id = (?)', [id]);
    }

    /**
     * get all actors 
     * @getAll 
     */
    getAll() {
        return this.db.all(`
            SELECT
                id, login, avatar_url
            FROM (
                SELECT
                    COUNT(DATE(e.created_at)) as t,
                    MAX(DATE(e.created_at)) as l_day,
                    a.*
                FROM actors AS a
                INNER JOIN events AS e
                ON a.id = e.actor_id
                GROUP BY login
            )
            ORDER BY t DESC, l_day DESC, login
        `)
    }

    /**
     * Update an actors records
     * @updateOne
     * @param {number} id - integer id for an actor.
     * @param {string} avatar_url - avatar url
     */
    updateOne(avatar_url, id) {
        return this.db.run('UPDATE actors SET avatar_url = (?) WHERE id = (?)', [avatar_url, id])
    }

    /**
     * Get actors streak
     * @getStreak
     */
    getStreak() {
        return this.db.all(`
            SELECT
                id, login, avatar_url
            FROM (
                SELECT
                    MAX (DATE(e.created_at)) AS l_day,
                    COUNT(DISTINCT DATE(e.created_at)) AS max_streak,
                    a.*
                FROM actors AS a
                JOIN events AS e
                ON a.id = e.actor_id
                GROUP BY login
            )
            ORDER BY max_streak DESC, l_day DESC, login
        `)
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

module.exports = ActorModel;