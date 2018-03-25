import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';

import { Docs } from '../../../docs.js';



Meteor.methods({
  addDocument( file ) {
    
    console.log("inside method")
    Docs.insert({
        file: file,
        });
  }
});

