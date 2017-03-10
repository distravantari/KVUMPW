// var moment = require('moment');

module.exports = function (orm, db) {
  var Facetwo = db.define('Facetwo', {
    Id          : { type: 'number', required: false },
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
