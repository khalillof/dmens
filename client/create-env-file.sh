#!/bin/sh

touch .env
echo "PORT=${PORT}"  >> .env
echo "NODE_ENV=${NODE_ENV}" >> .env
echo "ADMIN_EMAIL=${ADMIN_EMAIL}" >> .env
echo "ADMIN_USERNAME=${ADMIN_USERNAME}" >> .env
echo "ADMIN_PASSWORD=${ADMIN_USERNAME}" >> .env
echo "SECRET_KEY=${SECRET_KEY}" >> .env
echo "JWT_SECRET=${JWT_SECRET}" >> .env
echo "JWT_EXPIRATION=${JWT_EXPIRATION}"   >> .env
echo "JWT_REFRESH_EXPIRATION=${JWT_REFRESH_EXPIRATION}"  >> .env
echo "ISSUER=${ISSUER}"  >> .env
echo "AUDIENCE=${AUDIENCE}"  >> .env
echo "GCP_MAP_API_KEY=${GCP_MAP_API_KEY}"  >> .env
echo "COSMOSDB_CON=${COSMOSDB_CON}" >> .env
echo "DB_CONNECTION_CLUSTER=${DB_CONNECTION_CLUSTER}"  >> .env
echo "SCHEMA_DIR_PROD=${SCHEMA_DIR_PROD}"  >> .env
echo "IMAGES_UPLOAD_DIR_PROD=${IMAGES_UPLOAD_DIR_PROD}" >> .env
echo "ORIGIN_PROD=${ORIGIN_PROD}" >> .env
echo "CORES_DMAINS_PROD=${CORES_DMAINS_PROD}" >> .env
echo "STATIC_URL_PROD=${STATIC_URL_PROD}" >> .env

echo "printing the first two line from the .env file"
head -2 ./.env
#echo "moving env file to client directory"
#mv .env ./client