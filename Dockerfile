FROM node:12-alpine

# Create app directory
WORKDIR full-stack-backend/

COPY package*.json /full-stack-backend/
RUN npm install
COPY . .
EXPOSE 8001
CMD [ "node", "src/app.js" ]
