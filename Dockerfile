
################################### stage one
FROM node:latest as builder

# install dependencies for node-gyp
#RUN apk add --no-cache python make g++

WORKDIR /app

COPY  ./dist .
COPY  ./package-lock.json .
COPY  ./package.json .
RUN npm ci  --only=production --omit=dev

################################### stage two
FROM node:latest

EXPOSE 3000
ENV NODE_ENV=production
ARG appDir=/home/node/app

USER node
RUN mkdir -p ${appDir}
WORKDIR ${appDir}

#COPY --chown=userGroup:userGroup . . ## this feature is only supported in lunix containers otherwie use #RUN chown -R node:node  .
#COPY --chown=node:node . .

#COPY --from=builder /app/node_modules  ${appDir}/node_modules
COPY --chown=node:node  --from=builder /app  .

CMD ["npm", "run","start-prod"]

