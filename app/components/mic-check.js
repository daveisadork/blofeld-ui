import Ember from 'ember';

export default Ember.Component.extend({
  checkElement (element) {
    var that = this;
    var store = this.get('targetObject.store');
    element.oncanplay = function () {
      var keys = this.id.split('-');
      var method = keys[0];
      var name = keys[1];
      var supported = !this.error;
      store.query('format', {name: name}).then(
        function (records) {
          var record = records.objectAt(0);
          return record;
        },
        function () {
          var record = store.createRecord('format', {
            name: name,
            direct: false,
            transcode: false
          });
          return record;
        }
      ).then(function (record) {
        record.set(method, supported);
        record.save().then(function (record) {
          if (that.elements.length) {
            that.checkElement(that.elements.shift());
          }
        });
      });
    };
    element.onerror = element.oncanplay;
    element.load();
  },

  didInsertElement () {
    this.elements = this.$('#mic-check audio').toArray();
    this.checkElement(this.elements.shift());
  }
});
