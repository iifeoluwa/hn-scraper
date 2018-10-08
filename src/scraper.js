'use strict';

const got = require('got');
const cheerio = require('cheerio');
const { 
    calculatePagesToFetch, 
    isValidStory, 
    isValidInput, 
    logError } = require('./lib/helpers');

const args = require('minimist')(process.argv.slice(2));

const HN_URL = 'https://news.ycombinator.com/news';
const STORIES_PER_PAGE = 30;
let storiesToFetch = 20;

function fetchBody(page = 1) {
    return got(`${HN_URL}?p=${page}`)
        .then(response => {
            return response.body;
        })
        .catch(error => {
            logError(error)
        });
}

async function scrapePage(pages) {
    const stories = [];
    let page = 1;

    while(page <= pages) {
        const pageBody = await fetchBody(page);
        const $ = cheerio.load(pageBody);

        $('.athing').each(function(index, element) {
            if (stories.length !== parseInt(args.posts)) {
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

function startScraping() {
    if(isValidInput(args)) {
        const pagesToScrape = calculatePagesToFetch(args.posts, STORIES_PER_PAGE);
        scrapePage(pagesToScrape)
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
}

startScraping();