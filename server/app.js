var koa = require('koa');
var send = require('koa-send');
// XXX: Add different configuration entrypoints!
var config = require('../config/server');
var request = require('superagent-promise');
var path = require('path');
var app = koa();


app.use(require('koa-bodyparser')());
app.use(require('koa-trie-router')(app));

if (process.env.NODE_ENV !== 'production') {
  app.use(require('component-koa')({
    path: '/build/build'
  }));
}
// single page app routing...
var INDEX = path.resolve(__dirname, '..', 'static', 'index.html');

app.use(function* (next) {
  yield next;
  if (this.request.path.indexOf('/ui/') !== 0) return;
  yield send(this, INDEX);
});

// routing!
app.post('/github/auth', require('./routes/github_auth')(app, config));
app.post('/azure/authorized_repo', require('./routes/azure_authorized')(app, config));


app.use(require('koa-static')(__dirname + '/../static/'));

app.listen(process.env.PORT || 60023);
