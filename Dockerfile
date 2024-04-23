# The instructions for the first stage
FROM node:20-alpine

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# Install dependencies
RUN apk --no-cache add python3 make g++
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /home/node

# Set phantom.js env config.
ENV PHANTOMJS_VERSION=2.1.1
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# # Install phantom.js
# RUN apk update && apk add --no-cache fontconfig curl curl-dev && \
#     cd /tmp && curl -Ls https://github.com/dustinblackman/phantomized/releases/download/${PHANTOMJS_VERSION}/dockerized-phantomjs.tar.gz | tar xz && \
#     cp -R lib lib64 / && \
#     cp -R usr/lib/x86_64-linux-gnu /usr/lib && \
#     cp -R usr/share /usr/share && \
#     cp -R etc/fonts /etc && \
#     curl -k -Ls https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-${PHANTOMJS_VERSION}-linux-x86_64.tar.bz2 | tar -jxf - && \
#     cp phantomjs-${PHANTOMJS_VERSION}-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs

COPY --chown=node:node package*.json ./

RUN yarn add phantomjs-prebuilt
RUN yarn global add html-pdf

RUN chmod -R a+rwx /home/node
RUN apk --update add ttf-freefont fontconfig && rm -rf /var/cache/apk/*

RUN yarn

# Export port
EXPOSE 3000

CMD [ "yarn", "start" ]
