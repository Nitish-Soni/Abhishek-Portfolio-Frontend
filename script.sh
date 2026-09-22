#!/bin/bash

DOMAIN="2nison6.au.auth0.com"
CLIENT_ID="XnerMI2FFgOxPWga3J0GjA7bmtnPTWJh"
CONNECTION="2nison6-Auth0-Database"

EMAILS=("nitish.soni@auth0.com" "nitish.soni@okta.com") 

for EMAIL in "${EMAILS[@]}"; do
  echo "Sending reset email to $EMAIL"
  curl --request POST \
    --url "https://$DOMAIN/dbconnections/change_password" \
    --header 'content-type: application/json' \
    --data "{\"client_id\":\"$CLIENT_ID\",\"email\":\"$EMAIL\",\"connection\":\"$CONNECTION\"}"
  echo ""
done