var Vue = require('vue');
var session = require('../store/github_session')();
var co = require('co-promise');

module.exports = Vue.extend({
  template: require('./header.html'),

  data: {
    githubUser: null,
    githubError: null
  },

  methods: {
    login: function() {
      session.requestLogin();
    },

    logout: function() {
      var data = this.$data;
      co(function* () {
        data.githubUser = null;
        yield session.destroy();
      });
    },
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
