var Octokit = require('octokit.js');
var request = require('superagent-promise');
var store = require('localforage');

var LOGIN_URL =
  'https://github.com/login/oauth/authorize?client_id=2438bdf53de2aec632cd&scope=repo';

var AUTHORIZE_URL = '/github/auth';

module.exports = function() {
  return {
    hasCredentials: function *() {
      return !!(yield this.getCredentials());
    },

    getCredentials: function *() {
      return yield store.getItem('github credentials');
    },

    setCredentials: function *(credentials) {
      return yield store.setItem('github credentials', credentials);
    },

    getUser: function* () {
      return yield store.getItem('github user');
    },

    setUser: function* (user) {
      return yield store.setItem('github user', user);
    },

    requestLogin: function() {
      return window.location.href = LOGIN_URL;
    },

    authorizeCode: function *(code) {
      var res = yield request.post(AUTHORIZE_URL).
        send({ code: code }).
        end();

      if (res.error) throw res.error;
      return res.body;
    }
  };
};
