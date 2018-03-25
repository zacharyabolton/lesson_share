import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

import './main.html';

const Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';
  }
});

export default Images; // To be imported in other files

if (Meteor.isClient) {
  Meteor.subscribe('files.images.all');

  import { Template }    from 'meteor/templating';
	import { ReactiveVar } from 'meteor/reactive-var';
	Template.uploadForm.onCreated(function () {
	  this.currentUpload = new ReactiveVar(false);
	});

	Template.uploadForm.helpers({
	  currentUpload() {
	    return Template.instance().currentUpload.get();
	  }
	});

	Template.uploadForm.events({
	  'change #fileInput'(e, template) {
	    if (e.currentTarget.files && e.currentTarget.files[0]) {
	      // We upload only one file, in case
	      // multiple files were selected
	      const upload = Images.insert({
	        file: e.currentTarget.files[0],
	        streams: 'dynamic',
	        chunkSize: 'dynamic'
	      }, false);

	      upload.on('start', function () {
	        template.currentUpload.set(this);
	      });

	      upload.on('end', function (error, fileObj) {
	        if (error) {
	          alert('Error during upload: ' + error);
	        } else {
	          alert('File "' + fileObj.name + '" successfully uploaded');
	        }
	        template.currentUpload.set(false);
	      });

	      upload.start();
	    }
	  }
	});
}

if (Meteor.isServer) {
  Meteor.publish('files.images.all', function () {
    return Images.find().cursor;
  });

  // As plain base64:
	Images.insert({
	  file: 'base64str…',
	  isBase64: true, // <— Mandatory
	  fileName: 'pic.png', // <— Mandatory
	  type: 'image/png' // <— Mandatory
	});
}