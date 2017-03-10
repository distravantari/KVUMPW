module.exports = {
    local: (req, res, next) => {
        res.send(req.file);
        res.end(req.file);
    },
    dbsave: (req, res, next) => {
        // randomize the DB
        const choose = Number(Math.floor(Math.random() * 2)) + 1;
		console.log("DB I choose: ", choose);
        if(choose == 1){
            req.models.Faceone.create({face: req.body.face}, function(err){
                if(err) return next(err);
                else res.send('successfully add face to DB1');
            });
        }
        else{
            req.models.Facetwo.create({face: req.body.face}, function(err){
                if(err) return next(err);
                else res.send('successfully add face to DB2');
            });
        }
    }
};