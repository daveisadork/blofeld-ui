import Ember from 'ember';

var _formats = [
  {
    "attributes": {
      "name": "mp3"
    },
    "type": "format",
    "id": "mp3"
  },
  {
    "attributes": {
      "name": "ogg"
    },
    "type": "format",
    "id": "ogg"
  },
  {
    "attributes": {
      "name": "aac"
    },
    "type": "format",
    "id": "aac"
  },
  {
    "attributes": {
      "name": "opus"
    },
    "type": "format",
    "id": "opus"
  },
  {
    "attributes": {
      "name": "webm"
    },
    "type": "format",
    "id": "webm"
  },
  {
    "attributes": {
      "name": "wma"
    },
    "type": "format",
    "id": "wma"
  },
  {
    "attributes": {
      "name": "mp4"
    },
    "type": "format",
    "id": "mp4"
  },
  {
    "attributes": {
      "name": "mp2"
    },
    "type": "format",
    "id": "mp2"
  },
  {
    "attributes": {
      "name": "flac"
    },
    "type": "format",
    "id": "flac"
  },
  {
    "attributes": {
      "name": "wav"
    },
    "type": "format",
    "id": "wav"
  }
];

export default Ember.Component.extend({
  onLoadedData (event) {
    console.log('onLoadedData');
    window.removeEventListener('keydown', this.RBR);
    window.removeEventListener('mousedown', this.RBR);
    window.removeEventListener('touchstart', this.RBR);
    event.target.play();
  },

  audioElement: function () {
    return document.getElementById('mic-check');
  }.property(),

  RBR (event) {
    console.log('rbr');
    document.getElementById('mic-check').load();
  },

  checkFormats (records) {
    var element = this.get('audioElement');
    var format = records.shift();
    var srcBase = '/api/mic-check/';
    var method = 'direct';
    var that = this;
    var onPlay = function (event) {
      element.pause();
      element.removeAttribute('src');
      format.set(method + 'Supported', event.type==='play');
      format.set(method + 'Working', false);
      format.set(method + 'Checked', true);
      if (method === 'direct') {
        format.set('transcodeWorking', true);
        method = 'transcode';
        element.src = srcBase + 'transcode.' + format.get('name');
        element.load();
      } else {
        element.onplay = null;
        format.save().then(function (event) {
          console.log(event);
          if (records.length) {
            that.checkFormats(records);
          }
        });
      }
    };
    console.log(format);
    format.set('directWorking', true);
    element.onplay = onPlay;
    element.onerror = onPlay;
    element.src = srcBase + 'direct.' + format.get('name');
    element.preload = 'auto';
  },

  store: function () {
    return this.get('targetObject.store');
  }.property(),

  didInsertElement () {
    this.get('audioElement').onloadeddata = this.onLoadedData.bind(this);
    this.checkFormats(this.get('store').push({data: _formats}));
    window.addEventListener('keydown', this.RBR);
    window.addEventListener('mousedown', this.RBR);
    window.addEventListener('touchstart', this.RBR);
    //window.records = records;
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
