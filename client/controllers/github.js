var co = require('co');
var qs = require('querystring');

module.exports = function(app, session) {
  return {
    onGithubLogin: function() {
      session.requestLogin();
    },

    onGithubLogout: function* () {
      app.$data.githubUser = null;
      app.$data.githubError = null;
      yield session.destroy();
    },

    onGithubAuth: function* (code) {
      // remove the code from the query parameters
      history.replaceState({}, '', window.location.pathname);

      var auth = yield session.authorizeCode(code);
      if (auth.error) {
        return app.$data.githubError = auth.error;
      }

      // save the credentials for later
      yield session.setCredentials(auth);

      // get the current github username
      var client = yield session.getClient();
      var currentUser = yield client.getUser().getInfo();
      yield session.setUser(currentUser);

      return currentUser;
    },

    initialize: function* () {
      // check for github authentications
      var params = qs.parse(document.location.search);
      if (params.code) {
        yield this.onGithubAuth(params.code);
      }

      app.$on(
        'github login',
        this.onGithubLogin.bind(this)
      );

      app.$on(
        'github logout',
        co(this.onGithubLogout).bind(this)
      );

      // listen for logins
      app.$data.githubUser = yield session.getUser();
    }

  };
};
