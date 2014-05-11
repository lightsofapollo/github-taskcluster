// shared views across all routes
require('setimmediate.js');

var co = require('co');
var Vue = require('vue');
var Header = require('./views/header');
var forage = require('localforage');

// allow users to hit / but replace state /ui/ the entrypoint of pushstate...
if (document.location.pathname.indexOf('/ui/') !== 0) {
  history.replaceState({}, '', '/ui/' + document.location.search);
}

// initialize the Vue controller for this page
var app = new Vue({
  el: 'body',

  components: {
    'app-header': require('./views/header')
  },

  data: {
    githubUser: null,
    githubError: null,
  }
});

co(function* () {
  // initialize controllers
  yield [
    // set the current github user
    require('./controllers/github')(app)
  ];
})();

module.exports = app;
