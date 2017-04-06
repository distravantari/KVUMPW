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
    },
    dbsaveshadow: (req, res, next) => {
        req.models.Faceone.create({face: req.body.faceone, name: req.body.name}, function(err){
            if(err) return next(err);
            else {
                req.models.Facetwo.create({face: req.body.facetwo, name: req.body.name}, function(err){
                    if(err) return next(err);
                    else res.send('successfully add shadow to FACEONE and FACETWO DB');
                });
            }
        });
    }
};