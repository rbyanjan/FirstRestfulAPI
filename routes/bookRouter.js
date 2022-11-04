/* eslint-disabled no-param-reqssign */
const express = require('express');
const booksController = require('../controllers/booksController');
const jobsController = require('../controllers/jobsController');
const jobs = require('../data/jobs');

function routes(Book) {
    const bookRouter = express.Router();
    const controller = booksController(Book); //execute and pass Book to it
    const jobController = jobsController();
    bookRouter.route('/books')
        .post(controller.post)
        //moved below to controller
        //.post((req, res) => {
        //    const book = new Book(req.body);
        //    book.save(); // to save data via mongoose 
        //    console.log(book);
        //    return res.status(201).json(book);
        //})
        .get(controller.get);
        //moved below to controller
        //.get((req, res) => {
        //    //const response = { hello: 'This is my API' };
        //    //res.json(response);
        //    //const { query } = req; //use below instead to filter things to allow
        //    const query = {};
        //    if (req.query.genre) {
        //        query.genre = req.query.genre;
        //    } else if (req.query.title) {
        //        query.title = req.query.title;
        //    } else if (req.query.author) {
        //        query.author = req.query.author;
        //    } else if (req.query.read) {
        //        query.read = req.query.read;
        //    }
        //    Book.find(query, (err, books) => {
        //        if (err) {
        //            return res.send(err);
        //        } /* below is else portion */
        //        return res.json(books);
        //    });
        //});
    
    bookRouter.route('/jobs')
        .post(jobController.post)
        //moved below to controller
        //.post((req, res) => {
        //    const book = new Book(req.body);
        //    book.save(); // to save data via mongoose 
        //    console.log(book);
        //    return res.status(201).json(book);
        //})
        .get(jobController.get);

    //Midleware between Client and Route that will intercept the request, below it is used to findByID function
    //use only in route that has bookId
    //next is the function used by Middleware that signal it is done with processing and it is ready to pass that request to the next thing (.get or .put)
    bookRouter.use('/books/:bookId', (req, res, next) => {
        Book.findById(req.params.bookId, (err, book) => {
            if (err) {
                return res.send(err);
            }
            //if book exists we need to pass it downstream to the routes
            if (book) {  //req.book = book
                req.book = book;
                return next();
            }
            return res.sendStatus(404); //if book is not found 
        });
    });   

    bookRouter.route('/books/:bookId')
        .get((req, res) => res.json(req.book))
        //moved to middleware
        //.get((req, res) => {
        //    Book.findById(req.params.bookID, (err, book) => {
        //        if (err) {
        //            return res.send(err);
        //        } /* below is else portion */
        //        return res.json(book);
        //    });
        //})
        .put((req, res) => {
            //replace with middleware
            //Book.findById(req.params.bookID, (err, book) => {
            //    if (err) {
            //        return res.send(err);
            //    } /* below is else portion */
            //pull book out of the request, and now everything that's in req.book is being modified with whatever is in req.body
            const { book } = req;
            book.title = req.body.title;
            book.author = req.body.author;
            book.genre = req.body.genre;
            book.read = req.body.read;
            //not asynchronous
            //book.save();
            //return res.json(book);
            //asynchronous
            req.book.save((err) => {
                if (err) {
                    return res.send(err);
                }
                return res.json(book);
            });
        })
        .patch((req, res) => {
            const { book } = req;
            // eslint-disable-next-line no-underscore-dangle
            if (req.body._id) {
                // eslint-disable-next-line no-underscore-dangle
                delete req.body._id;
            }
            Object.entries(req.body).forEach((item) => {
                const key = item[0];
                const value = item[1];
                book[key] = value;
            });
            req.book.save((err) => {
                if (err) {
                    return res.send(err);
                }
                return res.json(book);
            });
        })
        .delete((req, res) => {
            req.book.remove((err) => {
                if (err) {
                    return res.send(err);
                }
                return res.sendStatus(204);
            });
        });

    bookRouter.use('/jobs/:jobId', (req, res, next) => {
        var id = req.params.jobId;
        var result = [];
        for (var i = 0; i < jobs.length; i++)
        {
            if (jobs[i].id == id){
                req.result = jobs[i];
                // console.log(result);
                // console.log(jobs[i])
                // return jobs[i];
                return next();
            }
            
        }
        return res.sendStatus(404); //if job is not found 
    });

    bookRouter.route('/jobs/:jobId')
        .get((req, res) => res.json(req.result))
            
    return bookRouter;
}

module.exports = routes;