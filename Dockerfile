FROM node:lts-alpine as builder
WORKDIR /usr/src/app
RUN chown -R node ./
COPY . .
USER node
RUN npm install 
RUN npm run build

FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production --silent && mv node_modules ../
COPY --from=builder /usr/src/app/dist /usr/src/app/
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start:prod"]