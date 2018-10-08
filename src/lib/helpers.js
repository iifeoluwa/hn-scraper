'use strict';

const Joi = require('joi');

const schema = Joi.object().keys({
    title: Joi.string().trim().min(1).max(256),
    author: Joi.string().trim().min(1).max(256),
    uri: Joi.string().uri(),
    points: Joi.number().integer().min(0),
    comments: Joi.number().integer().min(0),
    rank: Joi.number().integer().min(0)
});

function logError(message) {
    console.log(`hackernews: ${message}`);
    process.exit(1);
}

function isValidInput(args) {
    if(args.hasOwnProperty('posts') && Number.isInteger(args.posts)) {
        if(args.posts > 0 && args.posts <= 100) {
            return true;
        }
        logError('value for --posts must be between 1 and 100');
    } else {
        logError('value for --posts invalid. Expects an integer.')
    }
}

function calculatePagesToFetch(posts, perPage) {
    return Math.ceil(posts / perPage);
}

function isValidStory(data) {
    const result = Joi.validate(data, schema);

    if(result.error === null) {
        return true;
    }

    return false;
}

module.exports = {
    logError,
    isValidStory,
    isValidInput,
    calculatePagesToFetch
}