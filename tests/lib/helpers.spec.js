'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;

const {
    logError,
    isValidStory,
    validateInput,
    calculatePagesToFetch } = require('../../src/lib/helpers');

let consoleStub;
let processStub;

beforeEach(function() {
    consoleStub = sinon.stub(console, 'error');
    processStub = sinon.stub(process, 'exit');
});

afterEach(function () {
    consoleStub.restore();
    processStub.restore();
    sinon.restore();
});

describe('logError()', function() {
    it('should write passed message to stdout', function(done) {
        const message = 'This is a test message';
        processStub.withArgs(1).returns({});
        consoleStub.returns({});

        logError(message);

        expect(consoleStub.calledOnce).to.be.true;
        expect(processStub.calledOnce).to.be.true;
        expect(consoleStub.calledWith(`hackernews: ${message}`)).to.be.true;

        done();
    });
});

describe('calculatePagesToFetch()', function() {
    it('should return the number of pages required to fetch the stated amount of results', function(done) {
        expect(calculatePagesToFetch(30, 30)).to.equal(1);
        expect(calculatePagesToFetch(10, 30)).to.equal(1);
        expect(calculatePagesToFetch(40, 30)).to.equal(2);
        expect(calculatePagesToFetch(11, 2)).to.equal(6);
        done();
    });
});

describe('isValidStory()', function() {
    it('should reject objects that do not conform to the defined validation schema', function(done) {
        const validStory = {
            title: 'Shutting Down Google+ for Consumers',
            uri: 'https://blog.google/technology/safety-security/project-strobe/',
            author: 'Nemant',
            points: '575',
            comments: '322',
            rank: '1'
        }

        const inValidStory = {
            title: ' ',
            uri: 'https://blog.google/technology/safety-security/project-strobe/',
            author: 'Nemant',
            points: false,
            comments: '-2',
            rank: 'none'
        }
        expect(isValidStory(validStory)).to.be.true;
        expect(isValidStory(inValidStory)).to.be.false;
        done();
    });
});

describe('validateInput()', function() {    
    it('should return an error and exit when non integer value is passed', function(done) {
        const errorMessage = 'value for --posts invalid. Expects an integer.';
        processStub.withArgs(1).returns({});
        consoleStub.returns({});

        validateInput('some string');

        expect(consoleStub.calledOnce).to.be.true;
        expect(processStub.calledOnce).to.be.true;
        expect(consoleStub.calledWith(`hackernews: ${errorMessage}`)).to.be.true;

        done();
    });

    it('should return error for values not between 1 and 100', function(done) {
        const errorMessage = 'value for --posts must be between 1 and 100';
        processStub.withArgs(1).returns({});
        consoleStub.returns({});

        validateInput(0);

        expect(consoleStub.calledOnce).to.be.true;
        expect(processStub.calledOnce).to.be.true;
        expect(consoleStub.calledWith(`hackernews: ${errorMessage}`)).to.be.true;

        validateInput(129);

        expect(consoleStub.calledTwice).to.be.true;
        expect(processStub.calledTwice).to.be.true;
        expect(consoleStub.calledWith(`hackernews: ${errorMessage}`)).to.be.true;

        done();
    });

    it('should return value ofpassed argument if it is valid', function(done) {
        processStub.withArgs(1).returns({});

        const result = validateInput(10);

        expect(result).to.equal(10);
        expect(typeof result).to.equal('number');
        expect(consoleStub.calledOnce).to.be.false;
        expect(processStub.calledOnce).to.be.false;

        done();
    });
});