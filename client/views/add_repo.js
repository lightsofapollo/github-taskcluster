module.exports = {
  template: require('./add_repo.html'),

  data: {
    error: null
  },

  methods: {
    onAdd: function(e) {
      e.preventDefault();
      this.$dispatch('add repository', this.$data.repository, this);
    }
  }
};
