var Vue = require('vue');
var githubSession = require('../store/github_session')();

module.exports = Vue.extend({
  template: require('./header.html'),

  data: {
    githubUser: null,
    githubError: null
  },

  methods: {
    startLogin: function() {
      githubSession.requestLogin();
    }
  },

  computed: {
    noGithubUser: function() {
      return !this.githubUser;
    },

    hasGithubUser: function() {
      return this.githubUser;
    }
  },
});
