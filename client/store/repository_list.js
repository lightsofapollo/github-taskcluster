var AUTH = '/azure/unauthorized_repo';
var azureConnect = require('./azure_connect');

function RepositoryList(table) {
  this.table = table;
  this.etag = null;
}

RepositoryList.prototype = {

  all: function* () {
    var res = yield this.table.queryEntities().end();
    return (res.body && res.body.value) || [];
  }

};

function* connect() {
  var table = yield azureConnect(AUTH);
  return new RepositoryList(table);
}

module.exports.connect = connect;

