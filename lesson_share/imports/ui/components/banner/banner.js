import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';
import {ReactiveVar} from 'meteor/reactive-var';
import {ReactiveDict} from 'meteor/reactive-dict';

import './banner.html';

import {Docs} from '../../../api/docs/docs.js';

// Meteor.subscribe('files.docs.all');
Meteor.subscribe('docs');

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
	var userId = function(){
  	if (Meteor.userId()){
  		return Meteor.userId();
  	}else{
  		return false;
  	}
  };
  var userName = function(){
  	if (Meteor.user().profile.name){
  		return Meteor.user().profile.name;
  	}else{
  		return false;
  	}
  };
  this.currentFile = new ReactiveVar(false);
  this.uploadFields = new ReactiveDict({
  	'title': false,
    'subject': false,
    'grade': false,
    'tags': false,
    'owner': userId(),
    'author': userName(),
    'selectedFile': false
  });
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
          var fileVar = template.find('[name="selectedFile"]').files[0];
          
          Docs.insert({
            file: fileVar,
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
    'change .uploadForm, blur .uploadForm': function(event, template){
    	if (event.target.value != ''){
    		template.uploadFields.set(event.target.name, true);
    	}else{
    		template.uploadFields.set(event.target.name, false);
    	}

			if (	(template.uploadFields.get('title') !== false) && 
						(template.uploadFields.get('subject') !== false) && 
						(template.uploadFields.get('grade') !== false) && 
						(template.uploadFields.get('tags') !== false) && 
						(template.uploadFields.get('author') !== false) && 
						(template.uploadFields.get('owner') !== false) && 
						(template.uploadFields.get('selectedFile') !== false)){
				template.find('[id="submitUpload"]').disabled = false;
			}else{
				template.find('[id="submitUpload"]').disabled = true;
			}
    }
});