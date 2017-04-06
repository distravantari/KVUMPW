/* global __root */

var controllers = require('../app/controllers')
var multer = require('multer'); // to upload the secret face to a temporary file
var upload = multer({ dest: './client/store/tmp/' }); // this is the temporary destination file

// =======================
// Routes
// =======================
module.exports = function (app) {

	app.get("/admin/ping", (req, res) => {
		res.send("pong");
		// res.redirect('/users');
	}); 
	
	// app.post("/login", controllers.user.login);
	app.post("/detect", controllers.face.detect);
	app.get("/getAll", controllers.user.getAll);
	app.get("/", controllers.view.homePage);
	app.get("*", controllers.view.errorPage);
	app.post('/upload', upload.single("photo"), controllers.upload.local);
	app.post('/savephoto', controllers.upload.dbsave);
	app.post('/saveshadow', controllers.upload.dbsaveshadow);
	app.post('/getShadowCandidate', controllers.face.getShadowCandidate);
	app.post('/getShadow', controllers.face.getShadow);

};
