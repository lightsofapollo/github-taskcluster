var sign = require('azure-sign/table');

module.exports = function(app, config) {

  /**
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

    // all signatures expire in an hour!
    var expires = new Date();
    expires.setHours(expires.getHours() + 1);

    // normalized table name (should always be lowercase)
    var table = config.azure.repositoryTable.toLowerCase();

    var query = sign.sas({
      resource: table,
      signedexpiry: expires,
      signedpermissions: 'r'
    });

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
