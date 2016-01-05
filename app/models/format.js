import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  direct: DS.attr(),
  transcode: DS.attr(),
});
