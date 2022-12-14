const should = require('should');
const sinon = require('sinon');

const bookController = require('../controllers/booksController');

//Mocha lays out to very similar standard to BDD kind of style with a series of methods
describe('Book Controller Tests:', () => {
    describe('Post', () => {
        it('should not allow an empty title on post', () => {
            const Book = function (book) { this.save = () => { } };

            const req = {
                body: {
                    author: 'Jon'
                }
            };

            const res = {
                status: sinon.spy(),
                send: sinon.spy(),
                json: sinon.spy()
            };

            //hook this all up to our bookController by creating instance of bookController
            const controller = bookController(Book);
            controller.post(req, res);

            res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
            res.send.calledWith('Title is required').should.equal(true);
        });
    });
});

