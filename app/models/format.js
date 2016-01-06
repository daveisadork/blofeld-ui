import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  directSupported: DS.attr({default: false}),
  transcodeSupported: DS.attr({default: false}),
  directChecked: DS.attr({default: false}),
  transcodeChecked: DS.attr({default: false}),
  directWorking: DS.attr({default: false}),
  transcodeWorking: DS.attr({default: false}),
  directUiClass: Ember.computed(
    'directSupported', 'directWorking', 'directChecked', function() {
      if (this.get('directWorking')) {
        return "fa-circle-o-notch fa-spin";
      }
      if (!this.get('directChecked')) {
        return "fa-question";
      }
      if (this.get('directSupported')) {
        return "fa-check text-success";
      }
      return "fa-times text-danger";
    }
  ),
  transcodeUiClass: Ember.computed(
    'transcodeSupported', 'transcodeWorking', 'transcodeChecked', function() {
      if (this.get('transcodeWorking')) {
        return "fa-circle-o-notch fa-spin";
      }
      if (!this.get('transcodeChecked')) {
        return "fa-question";
      }
      if (this.get('transcodeSupported')) {
        return "fa-check text-success";
      }
      return "fa-times text-danger";
    }
  ),
});
