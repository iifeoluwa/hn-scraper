'use strict';

const got = require('got');
const cheerio = require('cheerio');
const args = require('minimist')(process.argv.slice(2));

const HN_URL = 'https://news.ycombinator.com/news';
const STORIES_PER_PAGE = 30;
let storiesToFetch = 20;

function isValidInput() {
    if(args.hasOwnProperty('posts') && Number.isInteger(args.posts)) {
        return true;
    } else {
        console.log('Value for --posts invalid. Expects an integer.');
        process.exit(1);
    }
}

function startScraping() {
    if(isValidInput()) {
        console.log('validated')
    }
}

startScraping();