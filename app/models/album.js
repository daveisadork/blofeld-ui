import DS from 'ember-data';

export default DS.Model.extend({
  albumArtist: DS.attr(),
  albumArtistId: DS.attr(),
  albumArtistSort: DS.attr(),
  artist: DS.attr(),
  artistsSort: DS.attr(),
  compilation: DS.attr(),
  date: DS.attr(),
  genre: DS.attr(),
  id: DS.attr(),
  location: DS.attr(),
  title: DS.attr(),
  titleSort: DS.attr(),
  totalTracks: DS.attr()
});
