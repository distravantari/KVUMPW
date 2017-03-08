// var moment = require('moment');

module.exports = function (orm, db) {
  var Faceone = db.define('Faceone', {
    Id          : { type: 'number', required: false },
    face        : { type: 'text', required: true }
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
