import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { ReactiveVar } from 'meteor/reactive-var';

import './search_page.html';

Template.search_page.onCreated( () => {
  let template = Template.instance();
  template.searchQuery = new ReactiveVar();
  template.searchQuery.set( '' );
  template.find('[name="search"]').value = '';
});

Template.search_page.helpers({
  query() {
    return Template.instance().searchQuery.get();
  },
});

Template.search_page.events({
  'keyup [name="search"]' ( event, template ) {
  	event.preventDefault();
    let value = event.target.value.trim();
    template.searchQuery.set( value );
  }
});