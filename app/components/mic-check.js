import Ember from 'ember';

export default Ember.Component.extend({
  checkElement (element) {
    var that = this;
    var store = this.get('targetObject.store');
    var handler = function (event) {
      console.log(this.id + ': ' + event.type);
      this.onsuspend = null;
      this.onerror = null;
      this.oncanplay = null;
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
        record.save().then(function () {
          if (that.elements.length) {
            that.checkElement(that.elements.shift());
          }
        });
      });
    };
    element.oncanplay = handler;
    element.onerror = handler;
    element.preload = 'auto';
  },

  checkAllElements() {
    this.elements = this.$('#mic-check audio').toArray();
    this.checkElement(this.elements.shift());
  },

  didInsertElement () {
    var that = this;
    var elements = this.$('#mic-check audio');
    var store = this.get('targetObject.store');
    store.findAll('format').then(function (records) {
      if ((records.get('length') * 2) !== elements.length) {
        that.checkAllElements();
      }
    });
  },

  actions: {
    forceCheck () {
      var store = this.get('targetObject.store');
      var that = this;
      store.findAll('format').then(
        function (records) {
          records.forEach(function (record) {
            record.destroyRecord();
          });
          that.checkAllElements();
        }
      );
    }
  }
});
