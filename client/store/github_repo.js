module.exports = function(session) {
  return {
    ownsRepo: function *(user, repo) {
      var client = yield session.getClient();
      var currentUser = yield session.getUser();

      return (
        yield client.getRepo(user, repo).isCollaborator(currentUser.login)
      );
    }
  };
};
