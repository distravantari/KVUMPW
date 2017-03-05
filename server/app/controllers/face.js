var cv = require('opencv');
// var buffer = new Buffer(img, 'base64');

module.exports = {
  detect: (req, res, next) => {
    var COLOR = [0, 255, 0]; // default red
    var thickness = 2; // default 1

    cv.readImage('./asd.jpg', function(err, im) {
    // cv.readImage(`./client/store/tmp/${req.body.photo}.jpg`, function(err, im) {
    // cv.readImage(req.body.photo, function(err, im) {
        if (err) throw err;
        if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size ');

        im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
            if (err) {
                res.send('is not a face');
                throw err;
            }
            else{
                for (var i = 0; i < faces.length; i++) {
                    face = faces[i];
                    im.rectangle([face.x, face.y], [face.width, face.height], COLOR, 2);
                }
                res.send('success ');
            }
        });
    });
  }
};