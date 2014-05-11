var Vue = require('vue');
var session = require('../store/github_session')();
var co = require('co');

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
      co(function* () {
        this.$data.githubUser = null;
        yield session.destroy();
        throw new Error('catch me?');
      }).call(this);
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
