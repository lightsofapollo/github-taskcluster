var co = require('co');
var repository = require('../store/repository_owner');

module.exports = function(app, session) {
  var githubRepo = require('../store/github_repo')(session);

  return {
    onAddRepository: function* (fullName, view) {
      var client = yield session.getClient();
      var [user, repo] = fullName.split('/');

      if (!user || !repo) {
        // XXX: l10n
        view.$data.error = 'Invalid repo "' + fullName + '" must be in the format of user/repo';
        return;
      }

      var userOwnsRepo = yield githubRepo.ownsRepo(user, repo);

      if (!userOwnsRepo) {
        // XXX: l10n
        view.$data.error = 'Cannot add ' + fullName + ' you are not a collaborator for this repo';
        return;
      }

      view.$data.error = null;

      var repoModel = yield repository.connect({
        user: user,
        repository: repo,
        token: (yield session.getCredentials()).token
      });

      var exists = yield repoModel.exists();

      if (!exists) {
        yield repoModel.insert();
      }

      app.$data.repositories.unshift(repoModel.entity);
    },

    initialize: function* () {
      app.$on(
        'add repository',
        co(this.onAddRepository).bind(this)
      );
    }
  };

};
