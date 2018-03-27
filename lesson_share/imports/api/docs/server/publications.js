import { Meteor } from 'meteor/meteor';
import { Docs } from '../docs.js';

import { check } from 'meteor/check';
import { Match } from 'meteor/check';

// Meteor.publish('docs', function () {
//   return Docs.find().cursor;
// });



Meteor.publish( 'docs', function( search ) {

	check( search, Match.OneOf( String, null, undefined ) );

	// console.log('inside publication');
	// console.log('searchQuery = '+search);

  let query      = {},
      projection = { limit: 10, sort: { title: 1 } };

  if ( search ) {
    let regex = new RegExp( search, 'i' );

    query = {
      $or: [
        { name: regex },
        { "meta.title": regex },
        { "meta.subject": regex },
        { "meta.tags": regex },
        { "meta.author": regex }
      ]
    };

    projection.limit = 100;
  }

  return Docs.find( query, projection ).cursor;
});