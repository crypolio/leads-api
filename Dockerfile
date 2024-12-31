# The instructions for the first stage
FROM node:20-alpine as builder

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Install dependencies
RUN apk --no-cache add python3 make g++
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

COPY --chown=node:node package*.json ./

RUN yarn

# The instructions for second stage
FROM node:20-alpine

WORKDIR /home/node
COPY --chown=node:node --from=builder node_modules node_modules

COPY --chown=node:node . .

# Export port
EXPOSE 3000

# Use the command based on NODE_ENV
CMD sh -c 'yarn start$([ "$NODE_ENV" = "dev" ] && echo ":dev")'

