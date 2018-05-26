'use strict';

const Hapi = require('hapi');
const pino = require('pino')();

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
  pino.info(request.method, request.path, request.payload, request.params, request.query)

  return h.continue;
};

const preResponse = function (request, h) {

  const response = request.response;
  // if is an error log it
  if (response.isBoom) {
    pino.info(response.output.payload);
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

  console.log(err);
  process.exit(1);
});

init();

function facebookVerificationHanlder(req, h){
  const challenge = req.query['hub.challenge'];
  const verify_token = req.pippo.query['hub.verify_token'];

  pino.info({challenge, verify_token}, 'Received facebook verification request');

  // TODO verify token
  return challenge;
};

function facebookNotificationHanlder(req, h){
  const message = req.payload;

  pino.info(message, 'Received facebook Notification message');

  return h.close;
};