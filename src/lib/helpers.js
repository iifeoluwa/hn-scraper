'use strict';

const { isUri } = require('valid-url');

export function logError(message) {
    console.log(`hackernews: ${message}`);
    process.exit(1);
}

export function isValidInput(args) {
    if(args.hasOwnProperty('posts') && Number.isInteger(args.posts)) {
        if(args.posts > 0 && args.posts <= 100) {
            return true;
        }
        logError('value for --posts must be between 1 and 100');
    } else {
        logError('value for --posts invalid. Expects an integer.')
    }
}

export function calculatePagesToFetch(posts) {
    return Math.ceil(posts / STORIES_PER_PAGE);
}

export function isValidUri(uri) {
    return isUri(uri);
}