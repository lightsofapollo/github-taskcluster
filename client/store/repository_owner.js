var request = require('superagent-promise');
var azureConnect = require('./azure_connect');

function Repository(github, table) {
  this.table = table;
  this.etag = null;
  this.entity = {
    PartitionKey: github.user,
    RowKey: github.repository
  };
}

Repository.prototype = {

  get: function* () {
    var req = this.table.getEntity(this.entity);
    try {
      var res = yield req.end();
    } catch (e) {
      if (e.status === 400 || e.status === 404) return null;
      throw e;
    }
    this.etag = res.header.etag;
    return this.entity = res.body;
  },

  exists: function* () {
    var entity = yield this.get();
    return !!entity;
  },

  insert: function* () {
    var req = this.table.insertEntity(this.entity);
    var res = yield req.end();
  },

};

function* connect(github) {
  var table = yield azureConnect('/azure/authorized_repo', { github: github });
  return new Repository(github, table);
}


module.exports.Repository = Repository;
module.exports.connect = connect;
