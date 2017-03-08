var cv = require('opencv');
// var buffer = new Buffer(img, 'base64');

module.exports = {
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
                    response = "success";
                }
                console.log('row ', im.row(0));
            }

            res.send(response);
        });
    });
  }
};