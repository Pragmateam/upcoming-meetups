#!/usr/bin/env bash

npm install
node ./infrastructure/claudiaDynamicSetup.js
./node_modules/.bin/claudia update --config claudia.json
rm -rf node_modules

# First time deploy
#./node_modules/.bin/claudia create \
#  --region ${AWS_REGION} \
#  --api-module index \
#  --name ${FUNCTION_NAME} \
#  --set-env MEETUP_API_KEY=${MEETUP_API_KEY}
