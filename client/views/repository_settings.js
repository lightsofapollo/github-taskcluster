module.exports = {
  template: require('./repository_settings.html'),

  ready: function() {
    this.$dispatch('view', this);
  },

  data: {
    repository: null,
    userOwnsRepository: null
  }

};
