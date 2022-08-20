#!/bin/bash

touch .env
echo PORT=${{ secrets.PORT }} >> .env
echo NODE_ENV=${{ secrets.NODE_ENV }} >> .env
echo ADMIN_EMAIL=${{ secrets.ADMIN_EMAIL }} >> .env
echo ADMIN_USERNAME=${{ secrets.ADMIN_USERNAME }} >> .env
echo ADMIN_PASSWORD=${{ secrets.ADMIN_USERNAME}} >> .env
echo SECRET_KEY=${{ secrets.SECRET_KEY }} >> .env
echo JWT_SECRET=${{ secrets.JWT_SECRET }} >> .env
echo JWT_EXPIRATION=${{secrets.JWT_EXPIRATION }}  >> .env
echo JWT_REFRESH_EXPIRATION=${{secrets.JWT_REFRESH_EXPIRATION }} >> .env
echo ISSUER=${{secrets.ISSUER }} >> .env
echo AUDIENCE=${{secrets.AUDIENCE }} >> .env
echo GCP_MAP_API_KEY=${{secrets.GCP_MAP_API_KEY }} >> .env
echo COSMOSDB_CON=${{secrets.COSMOSDB_CON }} >> .env
echo DB_CONNECTION_CLUSTER=${{secrets.DB_CONNECTION_CLUSTER }} >> .env
echo SCHEMA_DIR_PROD=${{secrets.SCHEMA_DIR_PROD }} >> .env
echo IMAGES_UPLOAD_DIR_PROD=${{secrets.IMAGES_UPLOAD_DIR_PROD }} >> .env
echo ORIGIN_PROD=${{secrets.ORIGIN_PROD }} >> .env
echo CORES_DMAINS_PROD=${{secrets.CORES_DMAINS_PROD }} >> .env
echo STATIC_URL_PROD=${{secrets.STATIC_URL_PROD }} >> .env

echo "printing the first two line from the .env file"
head -2 ./.env
echo "moving env file to client directory"
mv .env ./client