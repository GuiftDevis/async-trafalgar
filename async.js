const Async = () => {

    let self = this;

    this.map = (array, func, callback) => {
        // array => images
        // func => downloadImage
        // callback => function anonyme

        let count = array.length;
        let errors = [];
        let results = [];

        for (let i = 0; i < array.length; i++) {
            ((i) => {
                func(array[i], function (error, result) {
                    count--;

                    if (error) {
                        errors.push(error)
                    } else {
                        results.push(result)
                    }

                    if (count < 1) {
                        return callback((errors.length > 0) ? errors : null, results)
                    }
                })
            })(i)
        }
    };

    this.waterfall = () => {
        // precedante fonction sans resultat :
        // [0] jobs
        // [1] callback

        // precedante fonction avec resultat :
        // [0] jobs
        // [1] result  // de la precedante fonction
        // [2] callback

        let jobs = arguments[0];
        let callback = (arguments.length > 2) ? arguments[2] : arguments[1];

        let job = jobs.shift();

        let after = (error, result) => {
            if(error) return callback(error);
            if (jobs.length < 1) return callback(null, result);

            let args = [];
            args.push(jobs);
            if (result !== undefined) args.push(result);
            args.push((error, result) => {
                if (error) return callback(error);
                else return callback(null, result);
            });

            self.waterfall.apply(this, args);
        };

        // sans precedant resultat
        // [0] callback

        // avec precedant resultat
        // [0] result // de la precedante fonction
        // [1] callback

        let args = [];
        if(arguments.length > 2) args.push(arguments[1]);
        args.push(after);

        job.apply(this, args);
    };
};
module.exports = new Async();