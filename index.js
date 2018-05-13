'use strict';

const Hapi = require('hapi');
const pino = require('pino')();

const server = Hapi.server({
  port: 3000,
  host: '0.0.0.0'
});

server.route({
  method: 'GET',
  path: '/klm/facebook',
  handler: facebookVerificationHanlder
});

server.route({
  method: 'POST',
  path: '/klm/facebook',
  handler: facebookNotificationHanlder
});

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
  const verify_token = req.query['hub.verify_token'];

  pino.info({challenge, verify_token}, 'Received facebook verification request');

  // TODO verify token
  return challenge;
};

function facebookNotificationHanlder(req, h){
  const message = req.payload;

  pino.info(message, 'Received facebook Notification message');

  return h.close;
};