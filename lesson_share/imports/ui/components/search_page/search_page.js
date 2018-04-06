import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { ReactiveVar } from 'meteor/reactive-var';

import './search_page.html';

Template.search_page.onCreated( () => {
  let template = Template.instance();
  template.searchQuery = new ReactiveVar();
  // template.searchQuery.set( '' );
});

Template.search_page.onRendered( () => {
  let template = Template.instance();
  template.find('[name="search"]').value = '';
  template.find('[name="search"]').autofocus = true;
})

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

    // if ( value !== '' && event.keyCode === 13 ) {
    //   template.searching.set( true );
    // }

    // if ( value === '' ) {
    //   template.searchQuery.set( value );
    // }
  }
});