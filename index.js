'use strict';

const Hapi = require('hapi');
const pino = require('pino')();
const R = require('ramda');
const Path = require('path');

const server = Hapi.server({
  port: 3000,
  host: '0.0.0.0',
  routes: {
    files: {
      relativeTo: Path.join(__dirname, 'www')
    }
  }
});

server.route({
  method: 'GET',
  path: '/privacy_policy.html',
  handler: function (request, h) {

    return h.file('privacy_policy.html');
  }
});

server.route({
  method: 'GET',
  path: '/facebook/webhooks',
  handler: facebookVerificationHandler
});

server.route({
  method: 'POST',
  path: '/facebook/webhooks',
  handler: facebookNotificationHandler
});

const onRequest = function(request, h){
  pino.info({request: request.method, path: request.path, payload: request.payload, params: request.params, query: request.query});

  return h.continue;
};

const preResponse = function (request, h) {

  const response = request.response;
  // if is an error log it
  if (response.isBoom) {
    pino.info({stack: response.stack, payload: response.output.payload});
  }

  return h.continue;
};

server.ext('onRequest', onRequest);
server.ext('onPreResponse', preResponse);

function facebookVerificationHandler(req, h){
  const challenge = R.path(['query', 'hub.challenge'], req);
  const verify_token = R.path(['query', 'hub.verify_token'], req);

  pino.info({challenge, verify_token});

  // TODO verify token
  return challenge;
};

function facebookNotificationHandler(req, h){
  const notification = R.path(['payload'], req);

  pino.info(notification);

  return h.close;
};

process.on('unhandledRejection', (err) => {

  pino.error(err);
  process.exit(1);
});

const init = async () => {

  await server.register(require('inert'));
  await server.start();

  pino.info({msg: `Server running at: ${server.info.uri}`});
};

init();