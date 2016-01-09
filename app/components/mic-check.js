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
  onLoadedData () {
    console.log('onLoadedData');
    var element = document.getElementById('mic-check');
    // element.onloadeddata = null;
    // window.removeEventListener('keydown', this.RBR);
    // window.removeEventListener('mousedown', this.RBR);
    // window.removeEventListener('touchstart', this.RBR);
    // element.preload = 'auto';
    element.play();
    // element.autoplay = true;
    // return true;
  },

  audioElement: function () {
    return document.getElementById('mic-check');
  }.property(),

  RBR (event) {
    console.log(event.type);
    document.getElementById('mic-check').load();
    return true;
  },

  checkFormats (records) {
    console.log('checkFormats(records['+ (records && records.length)+']);');
    if (!records) {
      records = this.get('store').push({data: _formats});
    }
    var element = document.getElementById('mic-check');
    var format = records.shift();
    var srcBase = '/api/mic-check/';
    var method = 'direct';
    var that = this;
    format.set('directWorking', true);

    var sendEvents = true;
    var ignoreEvents = false;
    var state = {};
    var doLog = function (message) {
      console.log(message + ' ' + format.get('name') + ' ' + method);
    };

    var resetElement = function () {
      sendEvents = false;
      ignoreEvents = true;
      state = {};
      element.pause();
      element.removeAttribute('src');
    };

    var setFormat = function (supported) {
      resetElement();
      format.set(method + 'Supported', supported);
      format.set(method + 'Working', false);
      format.set(method + 'Checked', true);
      doLog('supported is ' + supported);
    };

    var doNextAction = function () {
      if (method === 'direct') {
        format.set('transcodeWorking', true);
        method = 'transcode';
        sendEvents = true;
        ignoreEvents = false;
        element.src = srcBase + 'transcode.' + format.get('name');
      } else {
        format.save().then(function () {
          if (records.length) {
            that.checkFormats(records);
          } else {
            that.get('store').findAll('format').then(function (records) {
              records.save();
            });
          }
        });
      }
    };

    var checkEvent = function (event) {
      var decoded = event.target.webkitAudioDecodedByteCount;
      var buffered = event.target.buffered.length;
      var currentTime = event.target.currentTime;
      doLog('decoded ' + decoded + ' buffered ' + buffered + ' currentTime ' + currentTime);
      switch (event.type) {
        // case 'timeupdate':
        //   return 2;
        case 'waiting':
          if (state.playing) {
            return 1;
          }
        default:
          if (state[event.type]) {
            state[event.type] = state[event.type] + 1;
          } else {
            state[event.type] = 1;
          }
      }
      if (currentTime || buffered || decoded) {
        return 2;
      }
      if (buffered === 0 || decoded === 0) {
        if (state.timeupdate && state.progress > 2) {
          return 1;
        }
        if (state.ended) {
          return 1;
        }
      }
      return 0;
    };

    var onEvent = function (event) {
      if (ignoreEvents) {
        return;
      }
      if (event.type==='error' || element.error) {
        doLog('checking ' + event.type);
        setFormat(false);
        doNextAction();
      } else if (sendEvents) {
        doLog('checking ' + event.type);
        var status = checkEvent(event);
        if (status) {
          setFormat(status - 1);
          doNextAction();
        }
      } else {
        doLog('ignoring ' + event.type);
      }
    };

    element.oncanplay = onEvent;
    element.oncanplaythrough = onEvent;
    element.ondurationchange = onEvent;
    element.onemptied = onEvent;
    element.onended = onEvent;
    element.onended = onEvent;
    element.onerror = onEvent;
    element.onloadeddata = onEvent;
    element.onloadedmetadata = onEvent;
    element.onloadstart = onEvent;
    element.onpause = onEvent;
    element.onplay = onEvent;
    element.onplaying = onEvent;
    element.onprogress = onEvent;
    element.onstalled = onEvent;
    element.ontimeupdate = onEvent;
    element.onwaiting = onEvent;

    element.load();
    element.src = srcBase + 'direct.' + format.get('name');
  },

  store: function () {
    return this.get('targetObject.store');
  }.property(),

  didInsertElement () {
    this.get('store').push({data: _formats});
    this.checkFormats();
    // this.get('audioelement').onloadeddata = this.onloadedData.bind(this);
    // // this.checkFormats();
    // window.addEventListener('keydown', this.RBR);
    // window.addEventListener('mousedown', this.RBR);
    // window.addEventListener('touchstart', this.RBR);
  },

  actions: {
    forceCheck () {
      //document.getElementById('mic-check').src = null;
      // element.oncanplay = function (event) {
      //   event.target.play();
      // };
      this.checkFormats();
    }
  }
});
