module.exports = {
  template: require('./header.html'),

  data: {
    githubUser: null,
    githubError: null
  },

  methods: {
    login: function() {
      this.$dispatch('github login');
    },

    logout: function() {
      this.$dispatch('github logout');
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
};
