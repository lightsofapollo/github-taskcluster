var repositoryOwner = require('../store/repository_owner');

/**
Repository settings controller has one single repository and a single
view it manages for the majority of it's data.
*/
module.exports = function(app, session) {
  var githubRepo = require('../store/github_repo')(session);

  return {
    view: null,
    model: null,

    initialize: function* (user, repository, view) {
      // start with the repository disabled!
      view.$data.userOwnsRepository = false;

      var credentials = yield session.getCredentials();

      if (!credentials) {
        view.$data.error = 'Cannot view repository settings without logging in';
        return;
      }

      // check if a user owns this app
      var userOwnsApp = yield githubRepo.ownsRepo(user, repository);

      if (!userOwnsApp) {
        // XXX: l10n
        view.$data.error = 'You cannot update the settings for' +
                           'repositories you are not a collaborator of';
        return;
      }

      // user owns the app then fetch the entity and display it's settings...
      var model = yield repositoryOwner.connect({
        user: user,
        repository: repository,
        token: credentials.token
      });

      var entity = yield model.get();
      view.$data.userOwnsRepository = true;
      view.$data.repository = entity;
    }
  };

};
