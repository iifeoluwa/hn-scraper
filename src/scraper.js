'use strict';

const got = require('got');
const cheerio = require('cheerio');
const args = require('minimist')(process.argv.slice(2));

const HN_URL = 'https://news.ycombinator.com/news';
const STORIES_PER_PAGE = 30;
let storiesToFetch = 20;

function isValidInput() {
    if(args.hasOwnProperty('posts') && Number.isInteger(args.posts)) {
        if(args.posts > 0 && args.posts <= 100) {
            return true;
        }
        logError('value for --posts must be between 1 and 100');
    } else {
        logError('value for --posts invalid. Expects an integer.')
    }
}

function logError(message) {
    console.log(`hackernews: ${message}`);
    process.exit(1);
}

function fetchBody(page = 1) {
    return got(`${HN_URL}?p=${page}`)
        .then(response => {
            return response.body;
        })
        .catch(error => {
            logError(error)
        })
}

function calculatePagesToFetch() {
    return Math.ceil(args.posts / STORIES_PER_PAGE);
}

async function startScraping() {
    
}

startScraping();