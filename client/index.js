// shared views across all routes
require('setimmediate.js');

var Vue = require('vue');

var page = require('page');
var co = require('co');
var session = require('./store/github_session')();
var qs = require('querystring');

// allow users to hit / but replace state /ui/ the entrypoint of pushstate...
if (document.location.pathname.indexOf('/ui/') !== 0) {
  history.replaceState({}, '', '/ui/' + document.location.search);
}

// initialize the Vue controller for this page
var app = new Vue({
  el: 'body',

  components: {
    // re-usable components

    'app-header': require('./views/header'),
    'add-repository': require('./views/add_repo'),
    'list-repositories': require('./views/list_repos'),
    'repository-settings': require('./views/repository_settings'),

    // standalone pages which use components

    'home-page': require('./views/home_page'),
    'repository-settings-page': require('./views/repository_settings_page')
  },

  data: {
    githubUser: null,
    githubError: null,
    repositories: [],
    currentPage: null
  }

});

function route(path, fn) {
  page(path, function() {
    co(fn)(function(err) {
      if (!err) return;
      console.error('Error in routing path', path, err);
      throw err;
    });
  });
}

function* indexPage () {
  app.$data.currentPage = 'home-page';
  var repoController = require('./controllers/add_repo')(app, session);
  var repoControllerList = require('./controllers/repo_list')(app, session);

  yield [
    repoController.initialize(),
    repoControllerList.initialize()
  ]
}

route('/ui/', indexPage);

page('/ui/repo/:user/:repository/settings', function (ctx) {
  app.$data.currentPage = 'repository-settings-page';

  var user = ctx.params.user;
  var repository = ctx.params.repository;

 var repoSettingsController =
   require('./controllers/repo_settings')(app, session);

  app.$once('view', co(function* (view) {
    yield repoSettingsController.initialize(
      user,
      repository,
      view
    );
  }));

});

page.start();

// global initializing

co(function* () {
  var githubController = require('./controllers/github')(app, session);
  // initialize controllers
  yield [
    githubController.initialize(),
  ];
})();

module.exports = app;
