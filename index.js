'use strict';

const Hapi = require('hapi');
const pino = require('pino')();
const R = require('ramda');

const server = Hapi.server({
  port: 3000,
  host: '0.0.0.0'
});

server.route({
  method: 'GET',
  path: '/facebook/webhooks',
  handler: facebookVerificationHanlder
});

server.route({
  method: 'POST',
  path: '/facebook/webhooks',
  handler: facebookNotificationHanlder
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

const init = async () => {

  await server.start();

  pino.info({msg: `Server running at: ${server.info.uri}`});
};

process.on('unhandledRejection', (err) => {

  pino.error(err);
  process.exit(1);
});

init();

function facebookVerificationHanlder(req, h){
  const challenge = R.path(['query', 'hub.challenge'], req);
  const verify_token = R.path(['query', 'hub.verify_token'], req);

  pino.info({challenge, verify_token}, 'Received facebook verification request');

  // TODO verify token
  return challenge;
};

function facebookNotificationHanlder(req, h){
  const message = req.payload;

  pino.info(message, 'Received facebook Notification message');

  return h.close;
};