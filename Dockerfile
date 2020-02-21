FROM node:12.2.0-alpine

COPY --chown=node:node package.json package-lock.json tsconfig.json /
COPY --chown=node:node src/ /

RUN npm ci

WORKDIR /

CMD ["npm", "run", "service"]
