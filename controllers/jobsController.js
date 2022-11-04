const jobs = require('../data/jobs');

function jobsController(Jobs) {
    function post(req, res) {
        const job = new Jobs(req.body);
        if (!req.body.title) {
            res.status(400);
            return res.send('Title is required');
        }

        job.save(); // to save data via mongoose
        //console.log(book);
        res.status(201);
        return res.json(book);
    }

    function get(req, res) {
        // const query = {};
        // if (req.query.genre) {
        //     query.genre = req.query.genre;
        // } 
        // Jobs.find(query, (err, jobs) => {
        //     if (err) {
        //         return res.send(err);
        //     } /* below is else portion */
        //     return res.json(jobs);
        // });
                
        return res.json(jobs);
    }
    
    return { post, get };
}

module.exports = jobsController;