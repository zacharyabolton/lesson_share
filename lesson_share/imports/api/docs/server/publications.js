import { Meteor } from 'meteor/meteor';
import { Docs } from '../docs.js';

import { check } from 'meteor/check';
import { Match } from 'meteor/check';

Meteor.publish( 'docs', function( search ) {
  Meteor._sleepForMs(2000);
	check( search, Match.OneOf( String, null, undefined ) );
  
	// console.log('inside publication');
	// console.log('searchQuery = '+search);

  let query      = {},
      projection = { limit: 10, sort: { title: 1 } };

  if ( search ) {
    search = search.split(" ");
    let regex = [];
    for (var i in search){
      if (search[i].length > 1){
        regex.push(new RegExp( search[i] , 'i'));
      }
    }
    console.log(regex);
    // let regex = new RegExp( search, 'i' );

    query = {
      $or: [
        { name: {$in: regex} },
        { "meta.title": {$in: regex} },
        { "meta.subject": {$in: regex} },
        { "meta.tags": {$in: regex} },
        { "meta.author": {$in: regex} }
      ]
    };

    projection.limit = 100;
  }

  return Docs.find( query, projection ).cursor;
});