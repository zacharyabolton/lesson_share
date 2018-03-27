import { Meteor } from 'meteor/meteor';
import { Docs } from '../docs.js';

// Meteor.publish('files.docs.all', function () {
//   return Docs.find().cursor;
// });



Meteor.publish( 'docs', function( search ) {
	console.log('inside publication');
	console.log(search);
	console.log("does it ever get this far?")
  check( search, Match.OneOf( String, null, undefined ) );

  let query      = {},
      projection = { limit: 10, sort: { title: 1 } };

  if ( search ) {
    let regex = new RegExp( search, 'i' );

    query = {
      $or: [
        { title: regex },
        { author: regex },
        { subject: regex }
      ]
    };

    projection.limit = 100;
  }

  return Docs.find( query, projection ).cursor;
});