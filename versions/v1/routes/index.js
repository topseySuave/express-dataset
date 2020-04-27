const Events = require('./events');
const Actor = require('./actor');

const API_PREFIX = '/api/v1/';

const routes = (app) => {
    app.use(API_PREFIX, Events);
    app.use(API_PREFIX, Actor);
};

module.exports = routes;