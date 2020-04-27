const { actorsModel } = require('../');
const { isEqual } = require('lodash');

/**
 * Actors Controller
 * @ActorsController
 */
class ActorsController {
    /**
     * Get all Actors.
     * @getAllActors
     * @param {object} request - Request Object.
     * @param {object} response - Response Object.
     */
    static async getAllActors(req, res) {
        const actors = await actorsModel.getAll();
        if (actors.length) {
            return res.status(200).send(actors)
        }
        return res.status(400).send({ message: 'No record' });
    }

    /**
     * Update an actors records.
     * @updateActor
     * @param {object} request - Request Object.
     * @param {object} response - Response Object.
     */
    static async updateActor(req, res) {
        const actor = await actorsModel.getOne(req.body.id);
        if (actor) {
            if (!isEqual(actor, req.body)) {
                const added = await actorsModel.updateOne(req.body.avatar_url, req.body.id);
                const newActor = await actorsModel.getOne(req.body.id);
                return added && res.status(200).send(newActor);
            }
            return res.status(400).send({ message: 'Please update only the avatar_url field' })
        }
        return res.status(404).send({
            message: 'Actor doesn\'t exits'
        })
    }

    /**
     * Get an actors streak records
     * @getStreak
     * @param {object} request - Request Object.
     * @param {object} response - Response Object.
     */
    static async getStreak(req, res) {
        const actors = await actorsModel.getStreak();
        if (actors.length) {
            return res.status(200).send(actors)
        }
        return res.status(400).send({ message: 'No record' });
    }

}

module.exports = ActorsController;