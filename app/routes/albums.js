import Ember from 'ember';

var albums = [
  {
    "albumartistsort": "Bring Me the Horizon",
    "artist": [
      "Bring Me the Horizon"
    ],
    "totaltracks": 11,
    "compilation": false,
    "title": "Sempiternal",
    "albumartist_id": "EfphreFAinfWSGCQUUWVB9",
    "date": "2013",
    "albumartist": "Bring Me the Horizon",
    "location": "/Music/Bring Me the Horizon/Sempiternal",
    "genre": [
      "Metalcore"
    ],
    "_id": "2Ch7cvU94dvhS7TVSn7m97",
    "titlesort": "Sempiternal",
    "artistssort": [
      "Bring Me the Horizon"
    ]
  },
  {
    "albumartistsort": "Bring Me the Horizon",
    "artist": [
      "Bring Me the Horizon"
    ],
    "totaltracks": 11,
    "compilation": false,
    "title": "That’s the Spirit",
    "albumartist_id": "EfphreFAinfWSGCQUUWVB9",
    "date": "2015",
    "albumartist": "Bring Me the Horizon",
    "location": "/Music/Bring Me the Horizon/That’s the Spirit",
    "genre": [
      "Alternative Rock"
    ],
    "_id": "S9sLiXCZuqxBf4NPeZsxWf",
    "titlesort": "That’s the Spirit",
    "artistssort": [
      "Bring Me the Horizon"
    ]
  },
  {
    "albumartistsort": "Bring Me the Horizon",
    "artist": [
      "Bring Me the Horizon",
      "Bring Me the Horizon feat. Lights",
      "Bring Me the Horizon feat. Josh Franceshi",
      "Bring Me the Horizon feat. Josh Scogin"
    ],
    "totaltracks": 12,
    "compilation": false,
    "title": "There Is a Hell, Believe Me I've Seen It. There Is a Heaven, Let's Keep It a Secret",
    "albumartist_id": "EfphreFAinfWSGCQUUWVB9",
    "date": "2010",
    "albumartist": "Bring Me the Horizon",
    "location": "/Music/Bring Me the Horizon/There Is a Hell, Believe Me I've Seen It. There Is a Heaven, Let's Keep It a Secret",
    "genre": [
      "Metalcore"
    ],
    "_id": "aFq98FekBL2BvMttvQ2mih",
    "titlesort": "There Is a Hell, Believe Me I've Seen It. There Is a Heaven, Let's Keep It a Secret",
    "artistssort": [
      "Bring Me the Horizon",
      "Bring Me the Horizon feat. Lights",
      "Bring Me the Horizon feat. Franceshi, Josh",
      "Bring Me the Horizon feat. Scogin, Josh"
    ]
  }
];

export default Ember.Route.extend({
  model () {
    return albums;
  }
});
