import { Meteor } from 'meteor/meteor';
import { Docs } from '../docs.js';

Meteor.publish('files.docs.all', function () {
  return Docs.find().cursor;
});
