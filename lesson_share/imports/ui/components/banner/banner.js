import {Template} from 'meteor/templating';
import {Meteor} from 'meteor/meteor';

import './banner.html';


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
        console.log(rememberVar)
        console.log("Form submitted.");
        Meteor.loginWithPassword(emailVar, passwordVar);
    }
});

Template.dashboard.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
    }
});