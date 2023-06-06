FROM node:16.0.0
WORKDIR /app
COPY package*.json ./
RUN npm install -g agentkeepalive --save
RUN npm install pm2 -g
RUN npm install multer-s3
RUN npm i npm@latest -g
RUN npm cache clean --force
RUN rm -rf ~/.npm
RUN npm install --production
COPY . .
# RUN npm run build
EXPOSE 9001
# CMD [ "node", "index.js" ]
CMD ["pm2-runtime", "index.js"]