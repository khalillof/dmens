#!/bin/sh

envFile=./.env

touch $envFile
echo "PORT=$PORT"  >> $envFile
echo "NODE_ENV=$NODE_ENV" >> $envFile
echo "ADMIN_EMAIL=$ADMIN_EMAIL" >> $envFile
echo "ADMIN_USERNAME=$ADMIN_USERNAME" >> $envFile
echo "ADMIN_PASSWORD=$ADMIN_USERNAME" >> $envFile
echo "SECRET_KEY=$SECRET_KEY" >> $envFile
echo "JWT_SECRET=$JWT_SECRET" >> $envFile
echo "JWT_EXPIRATION=$JWT_EXPIRATION"   >> $envFile
echo "JWT_REFRESH_EXPIRATION=$JWT_REFRESH_EXPIRATION"  >> $envFile
echo "ISSUER=$ISSUER"  >> $envFile
echo "AUDIENCE=$AUDIENCE"  >> $envFile
echo "GCP_MAP_API_KEY=$GCP_MAP_API_KEY"  >> $envFile
echo "COSMOSDB_CON=$COSMOSDB_CON" >> $envFile
echo "DB_CONNECTION_CLUSTER=$DB_CONNECTION_CLUSTER"  >> $envFile
echo "SCHEMA_DIR_PROD=$SCHEMA_DIR_PROD"  >> $envFile
echo "IMAGES_UPLOAD_DIR_PROD=$IMAGES_UPLOAD_DIR_PROD" >> $envFile
echo "ORIGIN_PROD=$ORIGIN_PROD" >> $envFile
echo "CORES_DMAINS_PROD=$CORES_DMAINS_PROD" >> $envFile
echo "STATIC_URL_PROD=$STATIC_URL_PROD" >> $envFile

echo "printing the first two line from the .env file"
head -2 $envFile
#echo "moving env file to client directory"
#mv .env ./client

npm run client