import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';


import './banner.html';

import { Docs } from '../../../api/docs/docs.js';

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
  this.uploadInprogress = new ReactiveVar(false);
});

Template.dashboard.helpers({
  currentFile: function () {
    Template.instance().currentFile.get();
  }

});

let uploadModalHandler = function(event, template, hide){
	template.find('[name="title"]').readOnly = !hide;
  template.find('[name="subject"]').readOnly = !hide;
  template.find('[name="grade"]').disabled = !hide;
  template.find('[name="tags"]').readOnly = !hide;

 	template.find('[name="selectedFile"]').disabled = !hide;
 	template.find('[id="closeUploadModal"]').disabled = !hide;

 	template.find('[id="submitUpload"]').disabled = true;
	if (hide){
		$('#uploadModal').modal('hide');

	 	template.find('[name="title"]').value = '';
	  template.find('[name="subject"]').value = '';
	  template.find('[name="grade"]').value = '';
	  template.find('[name="tags"]').value = '';

	 	template.find('[name="selectedFile"]').value = '';
	}
}

Template.dashboard.events({
  'click .logout': function(event){
      event.preventDefault();
      Meteor.logout();
  },
  'click #submitUpload': function (event, template) {
      event.preventDefault();
      if (template.find('[name="selectedFile"]').files && template.find('[name="selectedFile"]').files[0]) {
      	var titleVar = template.find('[name="title"]').value;
        var subjectVar = template.find('[name="subject"]').value;
        var gradeVar = template.find('[name="grade"]').value;
        var tagsVar = template.find('[name="tags"]').value;
        var ownerVar = Meteor.userId();
        var authorVar = Meteor.user().profile.name;
        // We upload only one file, in case
        // there was multiple files selected
        var fileVar = template.find('[name="selectedFile"]').files[0];


        uploadModalHandler(event, template, false);
        template.uploadInprogress.set(true);
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
          	template.uploadInprogress.set(true);
            template.currentFile.set(this);
          },
          onUploaded: function (error, fileObj) {
            if (error) {
            	uploadModalHandler(event, template, true);
              alert('Error during upload: ' + error);
            } else {
            	uploadModalHandler(event, template, true);
              alert('File "' + fileObj.name + '" successfully uploaded');
            }
            template.currentFile.set(false);
            template.uploadInprogress.set(false);
          },
          streams: 'dynamic',
          chunkSize: 'dynamic'
        });
        
      }
  },
  'change .uploadForm, textinput .uploadForm, keyup .uploadForm': function(event, template){
  	var uploadInprogress = template.uploadInprogress.get();
  	if (!uploadInprogress){
    	if (	template.find('[name="title"]').value !== '' &&
    				template.find('[name="subject"]').value !== '' &&
    				template.find('[name="grade"]').value !== '' &&
    				template.find('[name="tags"]').value !== '' &&
    				template.find('[name="selectedFile"]').value !== ''	)
    	{
    		template.find('[id="submitUpload"]').disabled = false;
    	} else {
    		template.find('[id="submitUpload"]').disabled = true;
    	}
    }
  },
});