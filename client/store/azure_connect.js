var request = require('superagent-promise');
var AzureTable = require('azure-table/request.js');
var azureSasAdapter = require('azure-table/adapter/shared_signature.js');

function* connect (url, body) {
  var req = request.post(url);
  if (body) req.send(body);

  var res = yield req.end();

  if (res.error) throw res.error;

  var table = new AzureTable(
    res.body.table,
    azureSasAdapter(res.body)
  );

  table.set('Accept', 'application/json;odata=nometadata');
  return table;
}

module.exports = connect;
