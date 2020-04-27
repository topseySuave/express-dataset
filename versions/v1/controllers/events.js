const { eventsModel, reposModel, actorsModel } = require('../');

/**
 * Events Controller.
 * @EventsController
 */
class EventsController {

    /**
     * Get all Events.
     * @getAllEvents
     * @param {object} request - Request Object.
     * @param {object} response - Response Object.
     */
    static async getAllEvents(req, res) {
        const events = await eventsModel.getAll();
        if (events.length) {
            let newEvents = [];
            // we have at least one event in the database
            // so we want to get the actor and repo to merge with the event object to return
            for (let i = 0; i < events.length; i++) {
                const actor = await actorsModel.getOne(events[i].actor_id);
                const repo = await reposModel.getOne(events[i].repo_id);

                delete events[i].actor_id
                delete events[i].repo_id

                newEvents.push({
                    id: events[i].id,
                    type: events[i].type,
                    actor,
                    repo,
                    created_at: events[i].created_at
                });
            };
            return res.status(200).send(newEvents);
        }
        return res.status(200).send([])
    }

    /**
     * Add a new Event.
     * @addEvent
     * @param {object} request - Request Object.
     * @param {object} response - Response Object.
     */
    static async addEvent(req, res) {
        try {
            await eventsModel.createTable();
            await actorsModel.createTable();
            await reposModel.createTable();

            const event = await eventsModel.getOne(req.body.id);

            // if this is true then we already have the event in the database
            // and not need to proceed any further
            if (event) {
                return res.status(400).send({ message: 'Event already exists' })
            }

            let { login, avatar_url } = req.body.actor;
            let { name, url } = req.body.repo;
            let { type, id, created_at } = req.body;

            // First create the actor and repo before creating the event
            // because both the actor and repo are required for the event
            const actorCreated = await actorsModel.create(req.body.actor.id, login, avatar_url);
            const repoCreated = await reposModel.create(req.body.repo.id, name, url);

            // if they are successful then we can proceed to create the event
            if (actorCreated && repoCreated) {
                const createdEvent = await eventsModel.create(
                    id,
                    type,
                    req.body.actor.id,
                    req.body.repo.id,
                    created_at
                );

                if (createdEvent) {
                    return res.status(201).send(req.body);
                }
                throw 'Error Creating Event'

            }
            throw 'Error Creating Actor/Repo'
        } catch (error) {
            res.status(400).send({ error });
        }
    }

    /**
     * Get ALl Events based on the Actors id.
     * @getByActors
     * @param {object} request - Request Object.
     * @param {object} response - Response Object.
     */
    static async getByActors(req, res) {
        const events = await eventsModel.getEventsByActorsId(req.params.id);
        if (events.length) {
            let newEvents = [];
            // we have at least one event in the database
            // so we want to get the actor and repo to merge with the event object to return
            for (let i = 0; i < events.length; i++) {
                const actor = await actorsModel.getOne(events[i].actor_id);
                const repo = await reposModel.getOne(events[i].repo_id);

                delete events[i].actor_id
                delete events[i].repo_id

                newEvents.push({
                    id: events[i].id,
                    type: events[i].type,
                    actor,
                    repo,
                    created_at: events[i].created_at
                });
            };
            return res.status(200).send(newEvents);
        }
        return res.status(404).send({ message: 'Events list is empty' })
    }

    /**
     * Remove all events from the databse.
     * @eraseEvents
     * @param {object} request - Request Object.
     * @param {object} response - Response Object.
     */
    static async eraseEvents(req, res) {
        const erased = await eventsModel.erase()
        if (erased) {
            return res.status(200).send({ message: 'Erase All Events' });
        }
        return res.status(400).send({ message: 'Could not Erase All Events' });
    }
}

module.exports = EventsController;