var repoList = require('../store/repository_list');

module.exports = function(app, session) {
  return {
    list: null,

    initialize: function* () {
      // connect to the azure list
      var list = yield repoList.connect();
      this.list = list;

      // fetch the existing repositories...
      var repos = yield list.all();
      app.$data.repositories = repos;
    }
  };
};
