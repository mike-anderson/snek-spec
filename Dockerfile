FROM node:12.2.0-alpine

COPY --chown=node:node . .

RUN npm ci --only=prod

WORKDIR /

CMD ["npm", "run", "service"]
