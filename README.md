## HackerNews Scraper

### Description
---
This project crawls the [HackerNews](https://news.ycombinator.com/) website and scrapes data about the current top stories. The scraped stories are then written to `STDOUT` in `JSON` format.

HackerNews provides [an API](https://github.com/HackerNews/API) that enables clients consume information about the top posts. For our use case though, consuming the API would have proved inefficient because, in the worst case scenario we would need to make 100+ network requests to fetch the top 100 stories.

This solution makes a maximum of 4 network requests, as opposed to 100+ API calls it would have taken to fetch the top 100 posts with the HackerNews API.

### How To Run.

1. Download and install Node.js [here](https://nodejs.org/en/download/). Skip this step if you already have Node installed.

2. Download and install Git [here](https://git-scm.com/downloads). Skip this as well if you have Git already installed on your computer.

3. Open a command line window from a newly created folder and run the following command;
``` sh
git clone https://github.com/iifeoluwa/hn-scraper.git .
```

4. From the same command line window, run `npm install -g`

After completing the steps above, you can run the tool from any command line window using `hackernews`. It also accepts a `--posts` argument that specifies the number of stories it should return.

To run tests, run `npm test` from the project directory.

### Sample Usage

```sh
hackernews --posts 1

// Writes to STDOUT
[ { title: 'Lambda School Announces $14M Series A Led by GV',
    uri: 'https://lambdaschool.com/blog/lambda-school-announces-14-million-series-a-led-by-gv/',
    author: 'tosh',
    points: '31',
    comments: '17',
    rank: '1' } ]
```
### Libraries Used

The following libraries were used to create this tool;

- [Got](https://github.com/sindresorhus/got): A lightweight HTTP request library. Used this because the project required making simple GET requests, and it is one of the lightest, actively maintained library for making HTTP requests.
- [Cheerio](https://github.com/cheeriojs/cheerio): Cheerio was used to parse the HTML document and extract the needed data from the file. It provides an expressive API that makes it easy to find specific information in documents.
- [Minimist](https://github.com/substack/minimist): Parses the arguments passed to `hackernews` tool. Makes it easier to handle and validate inputs.
- [joi](): Tool used to enforce validation rules and ensure only validated stories are retrieved.



