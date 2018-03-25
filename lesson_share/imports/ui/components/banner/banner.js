import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';
import {ReactiveVar} from 'meteor/reactive-var';

import './banner.html';

import {Docs} from '../../../api/docs/docs.js';

// Meteor.subscribe('files.docs.all');

Template.register.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.registerEmail.value;
        var passwordVar = event.target.registerPassword.value;
        var nameVar = event.target.registerName.value;
        console.log("Form submitted.");
        Accounts.createUser({
            email: emailVar,
            password: passwordVar,
            name: nameVar
        });
    }
});

Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;
        var rememberVar = event.target.dropdownCheck.checked;
        console.log(rememberVar);
        console.log("Form submitted.");
        Meteor.loginWithPassword(emailVar, passwordVar);
    }
});

Template.dashboard.onCreated(function () {
  this.currentFile = new ReactiveVar(false);
});

Template.dashboard.helpers({
  currentFile: function () {
    Template.instance().currentFile.get();
  }
});


Template.dashboard.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
    },
    'click #submitUpload': function (event, template) {
        event.preventDefault();
        if (template.find('[name="selectedFile"]').files && template.find('[name="selectedFile"]').files[0]) {
          // We upload only one file, in case
          // there was multiple files selected
          var file = template.find('[name="selectedFile"]').files[0];
          Meteor.call('addDocument', file);
          // Docs.insert({
          //   file: file,
          //   onStart: function () {
          //     template.currentFile.set(this);
          //   },
          //   onUploaded: function (error, fileObj) {
          //     if (error) {
          //       alert('Error during upload: ' + error);
          //     } else {
          //       alert('File "' + fileObj.name + '" successfully uploaded');
          //     }
          //     template.currentFile.set(false);
          //   },
          //   streams: 'dynamic',
          //   chunkSize: 'dynamic'
          // });
        }
    },
});