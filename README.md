# Reasons
An application that tracks KLM customer sentiments by subscribing to KLM public social feeds.

# Design
The application subscribe to KLM Public page feeds and for each notification log it to console.

## Facebook integration
Configure a facebook App Web hook for KLM Page and define a callback URL where to send notification.
Bind this service to the callback URL base API configured above.

ie.
callback URL: https://klmerda.tk/facebook/webhooks

base API: https://klmerda.tk

## Facebook Web hook handler
Implement Web Hook handler as per https://developers.facebook.com/docs/graph-api/webhooks/getting-started

# Environment Variables

The application listen on port 3000
