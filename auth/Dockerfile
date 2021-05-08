FROM node:12-alpine3.12

WORKDIR /auth
COPY package.json yarn.lock /auth/
RUN yarn install

ENTRYPOINT ["yarn"]
CMD ["help"]
