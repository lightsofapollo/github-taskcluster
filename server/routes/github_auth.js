module.exports = function(app, config) {
  return function* () {
    var code = this.request.body.code;

    // issue a response back to github
    var req = request.post(config.github.loginUrl);
    req.set('Accept', 'application/json');
    req.query({
      client_id: config.github.clientId,
      client_secret: config.github.clientSecret,
      code: code
    });

    var res = yield req.end();
    if (res.error) {
      console.error(res.error);
      return this.throw('Could not authenticate with github');
    }
    this.body = res.body;
  };
};
