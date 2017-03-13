// var moment = require('moment');

module.exports = function (orm, db) {
  var Faceone = db.define('FaceDB', {
    face        : Object
  },
  {
    methods: {
      serialize: function () {
        return {
          face : this.face
        }
      }
    }
  });
};
