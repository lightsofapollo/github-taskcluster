var koa = require('koa');
var send = require('koa-send');
var request = require('superagent-promise');
var path = require('path');
var app = koa();

var INDEX = path.resolve(__dirname, '..', 'static', 'index.html');

app.use(require('koa-bodyparser')());

app.use(require('component-koa')({
  path: '/build/build'
}));

app.use(require('koa-trie-router')(app));

app.use(function* (next) {
  yield next;
  if (this.request.path.indexOf('/ui/') !== 0) return;
  yield send(this, INDEX);
});

app.post('/github/auth', function* () {
  console.log(this.request, this.request.body);
  var code = this.request.body.code;

  // issue a response back to github
  var req = request.post('https://github.com/login/oauth/access_token');
  req.query({
    client_id: '2438bdf53de2aec632cd',
    client_secret: '3f35b5136b2956af6d6806f0a22435d33933e4e3',
    code: code
  });

  req.set('Accept', 'application/json');
  var res = yield req.end();
  if (res.error) {
    console.error(res.error);
    return this.throw('Could not authenticate with github');
  }
  this.body = res.body;
});

app.use(require('koa-static')(__dirname + '/../static/'));
app.listen(process.env.PORT || 60023);
