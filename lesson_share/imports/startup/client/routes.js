import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/results/results.js';
import '../../ui/pages/view/view.js';

import '../../ui/pages/not_found/not_found.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'App_home' });
  },
});

FlowRouter.route('/:params', {
  name: 'results',
  action() {
    BlazeLayout.render('App_body', { main: 'results' });
  },
});

FlowRouter.route('/view/:params', {
  name: 'view',
  action() {
    BlazeLayout.render('App_body', { main: 'view' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
