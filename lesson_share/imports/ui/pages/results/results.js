import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { ReactiveVar } from 'meteor/reactive-var';
import { Docs }  from '../../../api/docs/docs.js';

import './results.html';

import '../../components/banner/banner.js';

Template.results.onCreated( () => {

  let template = Template.instance();

  template.searchQuery = new ReactiveVar();
  // template.searching   = new ReactiveVar( false );

  template.searchQuery.set( '' );

  template.autorun( () => {
    template.subscribe( 'docs', FlowRouter.getParam('params'));
  });
});

Template.results.helpers({
  // searching() {
  //   return Template.instance().searching.get();
  // },
  query() {
  	// console.log(Template.instance().searchQuery.get())
    return Template.instance().searchQuery.get();
  },
  docs() {
    let docs = Docs.find();
    if ( docs ) {
      return docs;
    }
  },
  params() {
  	return FlowRouter.getParam('params')
  },
  fullDoc(docs){
    console.log(docs);
    return "fullDoc Helper returned this."
  }
});

Template.results.events({
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
  },
});
