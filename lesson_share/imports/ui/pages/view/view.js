import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Docs }  from '../../../api/docs/docs.js';

import { PDFJS } from 'meteor/pascoual:pdfjs';

import './view.html';

import '../../components/banner/banner.js';

Template.view.onCreated( () => {
	let template = Template.instance();
	template.autorun( () => {
	    template.subscribe( 'singleDoc', FlowRouter.getParam('params'));	    
	});
});

Template.view.helpers({
  pdfFile() {
    let pdfFile = Docs.findOne();
    if ( pdfFile ) {
      return pdfFile;
    }
  },
  PDFrenderer() {
  	let docURL = Docs.findOne().link();
	if ( docURL ) {
		// console.log(doc);
		PDFJS.workerSrc = '/packages/pascoual_pdfjs/build/pdf.worker.js';
		PDFJS.getDocument(docURL).then(function getPdfHelloWorld(pdf) {
			// Fetch the first page
			pdf.getPage(1).then(function getPageHelloWorld(page) {
				var scale = 1;
				var viewport = page.getViewport(scale);

				// Prepare canvas using PDF page dimensions
				var canvas = document.getElementById('pdfcanvas');
				var context = canvas.getContext('2d');
				canvas.height = viewport.height;
				canvas.width = viewport.width;

				// Render PDF page into canvas context
				page.render({canvasContext: context, viewport: viewport}).promise.then(function () {
				});
			});
		});
	}
  }
});