var Octokit = require('octokit');
var co = require('co-promise');
var qs = require('querystring');

module.exports = function (app, store) {
  var session = require('../store/github_session')();

  function* oauthLogin() {
    var params = qs.parse(document.location.search);
    // skip login if there is no code...
    if (!params.code) return;

    // remove the code from the query parameters
    history.replaceState({}, '', window.location.pathname);

    var auth = yield session.authorizeCode(params.code);
    if (auth.error) throw new Error(auth.error);

    // save the credentials for later
    yield session.setCredentials(auth);

    // get the current github username
    var client = Octokit.new({ token: auth.access_token });
    var currentUser = yield client.getUser().getInfo();
    yield session.setUser(currentUser);

    return currentUser;
  }

  return co(function *() {
    try {
      var user = (yield oauthLogin()) || (yield session.getUser());
      app.$data.githubUser = user;
    } catch(e) {
      console.error('github login error', e);
      app.$data.githubError = 'Error logging into github';
    }
  });
};
