var cv = require('opencv');

var COLOR = [0, 255, 0]; // default red
var thickness = 2; // default 1

cv.readImage('./asd.jpg', function(err, im) {
  if (err) console.log('img ',err);
  if (im.width() < 1 || im.height() < 1) console.log('img ',err);

  im.detectObject('./node_modules/opencv/data/haarcascade_frontalface_alt2.xml', {}, function(err, faces) {
    if (err) console.log('img ',err);

    for (var i = 0; i < faces.length; i++) {
      face = faces[i];
      im.rectangle([face.x, face.y], [face.width, face.height], COLOR, 2);
    }

    console.log('success')
    // im.save('./tmp/face-detection-rectangle.png');
    // console.log('Image saved to ./tmp/face-detection-rectangle.png '+im);
  });

});
