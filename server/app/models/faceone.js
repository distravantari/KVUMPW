// var moment = require('moment');

module.exports = function (orm, db) {
  var Faceone = db.define('Faceone', {
    face        : Object,
    name        : String
  },
  {
    methods: {
      serialize: function () {
        return {
          face    : this.face,
          name    : String
        }
      }
    }
  });
};
