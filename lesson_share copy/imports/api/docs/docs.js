// Definition of the docs collection

import { Mongo } from 'meteor/mongo';

import { FilesCollection } from 'meteor/ostrio:files';

export const Docs = new FilesCollection({
  
  collectionName: 'Docs',
  storagePath: 'assets/app/uploads/Docs',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in pdf formats
    if (file.size <= 10485760 && /pdf/i.test(file.extension)) {
      return true;
    }
    if (file.size > 10485760){
      return 'Please upload a PDF, with size equal or less than 10MB';
    } else {
      return 'Please upload doc in PDF file format.';
    }
    
  }
});