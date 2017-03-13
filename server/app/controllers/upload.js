module.exports = {
    local: (req, res, next) => {
        res.send(req.file);
        res.end(req.file);
    },
    dbsave: (req, res, next) => {
        req.models.FaceDB.create({face: req.body.face.body}, function(err){
            if(err) return next(err);
            else res.send('successfully add face to FACEDB');
        });
    }
};