
################################### stage one
FROM node:18.4.0-alpine3.15 as builder

# install dependencies for node-gyp
#RUN apk add --no-cache python make g++

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci  --only=production

################################### stage two
FROM node:18.4.0-alpine3.15

EXPOSE 3000
ENV NODE_ENV=production
ARG appDir=/home/node/app

USER node
RUN mkdir -p ${appDir}
WORKDIR ${appDir}

RUN mkdir ./ts-output
#COPY --chown=userGroup:userGroup . . ## this feature is only supported in lunix containers otherwie use #RUN chown -R node:node  .
COPY --chown=node:node . .

COPY --from=builder /app/node_modules  ${appDir}/node_modules

RUN chmod +x ./client/create-env-file.sh
RUN ./client/create-env-file.sh
RUN echo $ADMIN_USERNAME

CMD ["npm", "run","client"]
