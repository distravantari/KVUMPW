// var moment = require('moment');

module.exports = function (orm, db) {
  var Facetwo = db.define('Facetwo', {
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
