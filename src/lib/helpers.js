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

/**
 * Writes data to STDOUT and terminates the process with status code of 1.
 * @param {string} message data to be written to STDOUT
 */
function logError(message) {
    console.log(`hackernews: ${message}`);
    process.exit(1);
}

/**
 * Validates the posts argument, if it was passed when the program was executed.
 * @param {Object} postsValue 
 * @returns {Number} validated value of the posts argument
 */
function validateInput(postsValue) {
    if(Number.isInteger(postsValue)) {
        if(postsValue > 0 && postsValue <= 100) {
            return parseInt(postsValue);
        }
        logError('value for --posts must be between 1 and 100');
    } else {
        logError('value for --posts invalid. Expects an integer.')
    }
}

/**
 * Determines the number of pages the scraper would process.
 * Depends on the amount of stories displayed on each page and how many stories the user wants.
 * @param {Number} posts amount of HN top stories to be fetched.
 * @param {Number} perPage this is a constant that reflects the number of stories 
 *                         currently displayed on the HN homepage
 */
function calculatePagesToFetch(posts, perPage) {
    return Math.ceil(posts / perPage);
}

/**
 * Checks that the passed data meets the validation requirements enforced by the declared Joi schema
 * @param {Object} data object to be validated
 */
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
    validateInput,
    calculatePagesToFetch
}