'use strict';

const got = require('got');
const cheerio = require('cheerio');
const { 
    calculatePagesToFetch, 
    isValidStory, 
    validateInput, 
    logError } = require('./lib/helpers');

/**
 * Parses the process.argv array and returns object containing arguments passed to the script
 */
const args = require('minimist')(process.argv.slice(2));

const HN_URL = 'https://news.ycombinator.com/news';
/**
 * Amount of posts currently displayed on the HackerNews page.
 * Should always correspond to the actual value on HN to ensure correctness.
 */
const STORIES_PER_PAGE = 30;

/**
 * Retrieves the HTML content of the specified HN page.
 * @param {Number} page The HN page to be fetched.
 * @returns {string} String containing HTML content.
 */
function fetchBody(page) {
    return got(`${HN_URL}?p=${page}`)
        .then(response => {
            return response.body;
        })
        .catch(error => {
            logError(error)
        });
}

/**
 * Scrapes data from specific HN pages, parses the data and returns validated stories.
 * @param {Number} pages The number of pages data is to be scraped from
 * @param {Number} storiesToFetch Amount of top HNposts to fetch
 * @returns {Promise} array of objects created from traversing the HTML documents
 */
async function scrapePage(pages, storiesToFetch) {
    const stories = [];
    let page = 1;

    while(page <= pages) {
        const pageBody = await fetchBody(page);
        const $ = cheerio.load(pageBody);

        $('.athing').each(function(index, element) {
            if (stories.length !== storiesToFetch) {
                /**
                 * Calling .text() decodes all HTML entities to their corresponsing character values
                 * &nbsp; in HTML becomes \xa0, which is the character code for non-breaking space.
                 * That's why the string is being splited by \xa0 and not &nbsp; which exists in the actual HTML document
                 */
                const comment = $(this).next().children('.subtext')
                    .children().last().text().split('\xa0')[0];

                const story = {
                    title: $(this).find('.storylink').text(),
                    uri: $(this).find('.storylink').attr('href'),
                    author: $(this).next().find('.hnuser').text(),
                    points: $(this).next().find('.score').text().split(' ')[0],
                    comments: comment === 'discuss' ? 0 : comment,
                    rank: $(this).find('.rank').text().replace('.', '')
                }

                if(isValidStory(story)) {    
                    stories.push(story);
                } else {
                    return;
                }
                
            } else {
                /** 
                 * Break out of Cheerio `each` iteration since we have the number 
                 * of stories user requested.
                 */
                return false;
            }
            
        });

        page++;
    }

    return stories;
}

/**
 * Begins the page-scraping process and writes data successfully fetched to STDOUT
 */
function startScraping() {
    const storiesToFetch = args.hasOwnProperty('posts') ? validateInput(args.posts) : STORIES_PER_PAGE;
    const pagesToScrape = calculatePagesToFetch(storiesToFetch, STORIES_PER_PAGE);

    scrapePage(pagesToScrape, storiesToFetch)
        .then(stories => {
            if (stories.length !== 0) {
                console.log(stories);
                process.exit();
            }

            logError('No valid story found.')                
        })
        .catch(error => {
            logError(error);
        });
}

startScraping();