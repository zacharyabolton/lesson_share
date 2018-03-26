import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';
import {ReactiveVar} from 'meteor/reactive-var';

import './banner.html';

import {Docs} from '../../../api/docs/docs.js';

Meteor.subscribe('files.docs.all');

var form = document.querySelector('form')
var inputs = document.querySelectorAll('input')
var required_inputs = document.querySelectorAll('input[required]')
var register = document.querySelector('input[type="submit"]')

Template.register.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.registerEmail.value;
        var passwordVar = event.target.registerPassword.value;
        var nameVar = event.target.registerName.value;
        Accounts.createUser({
            email: emailVar,
            password: passwordVar,
            profile: {
            	name: nameVar
            }
        });
    }
});

Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
        var emailVar = event.target.loginEmail.value;
        var passwordVar = event.target.loginPassword.value;
        var rememberVar = event.target.dropdownCheck.checked;

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
          var titleVar = template.find('[name="title"]').value;
          var subjectVar = template.find('[name="subject"]').value;
          var gradeVar = template.find('[name="grade"]').value;
          var tagsVar = template.find('[name="tags"]').value;
          var ownerVar = Meteor.userId();
          var authorVar = Meteor.user().profile.name;
          var file = template.find('[name="selectedFile"]').files[0];
          
          Docs.insert({
            file: file,
            meta: {
            	title: titleVar,
            	subject: subjectVar,
            	grade: gradeVar,
            	tags: tagsVar,
            	owner: ownerVar,
            	author: authorVar
            },
            onStart: function () {
              template.currentFile.set(this);
            },
            onUploaded: function (error, fileObj) {
              if (error) {
                alert('Error during upload: ' + error);
              } else {
                alert('File "' + fileObj.name + '" successfully uploaded');
              }
              template.currentFile.set(false);
            },
            streams: 'dynamic',
            chunkSize: 'dynamic'
          });
        }
    },
    'change': function(event, template){
    	fields = {
	    	'titleVar': template.find('[name="title"]').value,
	      'subjectVar': template.find('[name="subject"]').value,
	      'gradeVar': template.find('[name="grade"]').value,
	      'tagsVar': template.find('[name="tags"]').value,
	      'ownerVar': Meteor.userId(),
	      'authorVar': Meteor.user().profile.name,
	      'file': template.find('[name="selectedFile"]').files[0]
	    };
	    console.log(fields)
	    var submitEnabled = false;
	    for (var key in fields){////// can be hacked by selected file at the start and leaving other fields blank...
	    	console.log(fields[key])
	    	submitEnabled = fields[key]
	    };
	    if (submitEnabled){

	    	console.log("success!")
	    } else {
	    	console.log("unsuccess...")
	    }



    }
});