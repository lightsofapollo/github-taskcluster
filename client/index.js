// shared views across all routes
require('setimmediate.js');

var co = require('co');
var session = require('./store/github_session')();
var Vue = require('vue');

// allow users to hit / but replace state /ui/ the entrypoint of pushstate...
if (document.location.pathname.indexOf('/ui/') !== 0) {
  history.replaceState({}, '', '/ui/' + document.location.search);
}

// initialize the Vue controller for this page
var app = new Vue({
  el: 'body',

  components: {
    'app-header': require('./views/header'),
    'add-repository': require('./views/add_repo')
  },

  data: {
    githubUser: null,
    githubError: null,
  }
});

co(function* () {
  var githubController = require('./controllers/github')(app, session);
  var repoController = require('./controllers/repo')(app, session);

  // initialize controllers
  yield [
    githubController.initialize(),
    repoController.initialize()
  ];
})();

module.exports = app;
