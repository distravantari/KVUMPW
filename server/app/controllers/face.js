var cv = require('opencv');
// var buffer = new Buffer(img, 'base64');

module.exports = {
    predictFace: (req, res, next) => {
        var trainingData = [];
        var images = fs.readdirSync("./client/store/tmp/");
        
        // Collect all the images we are going to use to test the algorithm
        // ".pgm" are grey scale images
        for (var j = 1; j<10; j++){
            trainingData.push([1,"./client/store/tmp/" + j + ".pgm" ]);
        }

        // Test algorithm
        cv.readImage("./client/store/tmp/face-target.png", function(e, im){

            var facerec = cv.FaceRecognizer.createLBPHFaceRecognizer();
            facerec.trainSync(trainingData);

            // Try to recognize the person in "s2_2.pgm" against the "s1" folder tests
            console.log(facerec.predictSync(im));

        });
    },
    detect: (req, res, next) => {
        var COLOR = [0, 255, 0]; // default red
        var thickness = 2; // default 1

        cv.readImage(req.body.photo, function(err, im) {
            let response = "error";
            if (err) throw err;
            if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size ');

            im.detectObject(cv.FACE_CASCADE, {}, function(err, faces) {
                if (err) {
                    // res.send('is not a face');
                    response += " cant use cascade";
                    throw err;
                }
                else{
                    if(faces.length <= 0){
                        // res.send('is not a face');
                        response += " is not a face";
                    }else{
                        for (var i = 0; i < faces.length; i++) {
                            face = faces[i];
                            im.rectangle([face.x, face.y], [face.width, face.height], COLOR, 2);
                        }
                        im.save('./client/store/tmp/face-target.png');
                        // res.send('success ');
                        response = "success ";
                    }
                    // console.log('row ', im.row(0));
                }

                res.send(response);
            });
        });
    },
    getShadowCandidate: (req, res, next) => {
        req.models.FaceDB.find().run(function (err, face) {
            if(err) return next(err);
            else res.send(face);
        });
    },
    getShadow: (req, res, next) => {
        req.models.Faceone.find({ name: req.body.name }).run(function (err, faceone) {
            // console.log("hai ", faceone[0].face.toString('utf8'));
            if(err) return next(err);
            else {
                req.models.Facetwo.find({ name: req.body.name }).run(function (err, facetwo) {
                    if(err) return next(err);
                    else res.send({
                        "shadow1": faceone,
                        "shadow2": facetwo
                    });
                });
            }
        });
    }
};