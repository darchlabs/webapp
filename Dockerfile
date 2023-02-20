FROM node:16

WORKDIR /user/src/app

COPY ./package.json ./

RUN npm ci

COPY ./ .

RUN npm run build

ENV NODE_ENV=production

CMD ["npm", "run", "start"]

