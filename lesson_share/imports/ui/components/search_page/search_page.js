import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';

import {ReactiveVar} from 'meteor/reactive-var';
import {Docs} from '../../../api/docs/docs.js';

import './search_page.html';

Template.search_page.onCreated( () => {
  let template = Template.instance();

  template.searchQuery = new ReactiveVar();
  template.searching   = new ReactiveVar( false );

  template.autorun( () => {
    template.subscribe( 'docs', template.searchQuery.get(), () => {
      setTimeout( () => {
        template.searching.set( false );
      }, 300 );
    });
  });
});

Template.search_page.helpers({
  searching() {
    return Template.instance().searching.get();
  },
  query() {
    return Template.instance().searchQuery.get();
  },
  docs() {
    let docs = Docs.find();
    if ( docs ) {
      return docs;
    }
  }
});

Template.search_page.events({
  'keyup [name="search"]' ( event, template ) {
  	event.preventDefault();
    let value = event.target.value.trim();

    if ( value !== '' && event.keyCode === 13 ) {

      template.searchQuery.set( value );
      template.searching.set( true );
      console.log('something worked')
    }

    if ( value === '' ) {
      template.searchQuery.set( value );
    }
  }
});