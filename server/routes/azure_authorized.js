var sign = require('azure-sign/table');
var github = require('octokit');

module.exports = function(app, config) {

  /**
  Request:

    {
      github: {
        user: 'github',
        repository: 'attack',
        token: 'wootbar'
      }
    }

  Response:

    // XXX: figure out expiry/refresh story

    {
      query: { ... },
      table: '...',
      host: '...',
      expires: new Date()
    }

  */
  return function* () {
    var body = this.request.body;

    // verify this user can really take action on the repository
    var githubClient = Octokit.new({ token: body.github.token });
    var ghUser = yield githubClient.getUser().getInfo();
    var ghRepo = githubClient.getRepo(body.github.user, body.github.repository);
    var isAuthorized = yield ghRepo.isCollaborator(ghUser.login);

    if (!isAuthorized) {
      this.throw(400, 'Github user is not authorized for this repository');
      return;
    }

    // all signatures expire in an hour!
    var expires = new Date();
    expires.setHour(expires.getHour() + 1);

    // normalized table name (should always be lowercase)
    var table = config.azure.repositoryTable.toLowerCase();

    var query = sign.sas({
      resource: config.azure.repositoryTable.toLowerCase(),
      signedexpiry: expires,
      signedpermissions: 'raud',
      startpk: body.github.user,
      startrk: body.github.repository,
      endpk: body.github.user,
      endrk: body.github.repository
    })

    var host = 'https://' + process.env.AZURE_STORAGE_ACCOUNT + '.' +
               'table.core.windows.net';

    this.body = {
      query: query,
      table: table,
      host: host,
      expires: expires,
    }
  };
};
