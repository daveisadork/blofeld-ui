import Ember from 'ember';

export default Ember.Component.extend({
  checkElement (element) {
    var that = this;
    var store = this.get('targetObject.store');
    var keys = element.id.split('-');
    var method = keys[0];
    var name = keys[1];
    element.preload = 'none';
    element.autoplay = false;
    element.src = element.src;
    var handler = function (event) {
      var supported = event.type !== 'error';
      store.query('format', {name: name}).then(function (records) {
        var record = records.objectAt(0);
        return record;
      }).then(function (record) {
        record.set(method+'Supported', supported);
        record.set(method+'Working', false);
        record.set(method+'Checked', true);
        record.save().then(function () {
          if (that.elements.length) {
            that.checkElement(that.elements.shift());
          }
        });
      });
    };
    element.onerror = handler;
    element.onplaying = handler;
    element.oncanplay = function () {
      element.play();
    };
    store.query('format', {name: name}).then(function (records) {
      var record = records.objectAt(0);
      record.set(method+'Working', true);
      record.save().then(function () {
        element.preload = 'auto';
      });
    });
  },

  checkAllElements() {
    this.elements = this.$('#mic-check audio').toArray();
    this.checkElement(this.elements.shift());
  },

  initializeRecords(checkElements) {
    var that = this;
    var store = this.get('targetObject.store');
    var elements = this.$('#mic-check audio.method-direct').toArray();
    var checkRecord = function (element) {
      var name = element.id.split('-')[1];
      store.query('format', {name: name}).then(
        function (records) {
          var record = records.objectAt(0);
          if (!record.get('directChecked') || !record.get('transcodeChecked')) {
            checkElements = true;
          }
          return false;
        },
        function () {
          var record = store.createRecord('format', {name: name});
          checkElements = true;
          return record;
        }
      ).then(function (record) {
        if (!record) {
          if (elements.length) {
            checkRecord(elements.shift());
          } else if (checkElements) {
            that.checkAllElements();
          }
          return;
        }
        record.save().then(function () {
          if (elements.length) {
            checkRecord(elements.shift());
          } else if (checkElements) {
            that.checkAllElements();
          }
        });
      });
    };
    checkRecord(elements.shift());
  },

  didInsertElement () {
    this.initializeRecords();
  },

  actions: {
    forceCheck () {
      var that = this;
      this.get('targetObject.store').findAll('format').then(
        function (records) {
          var recordsArray = records.toArray();
          var killit = function (record) {
            record.destroyRecord().then(function () {
              if (recordsArray.length) {
                killit(recordsArray.shift());
              } else {
                that.initializeRecords(true);
              }
            });
          };
          killit(recordsArray.shift());
        }
      );
    }
  }
});
