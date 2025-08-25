# using a official node24 run time as parent image

FROM node:24-alpine

# setting working dir
WORKDIR /serverapp

#copy package file to container

COPY ./package*.json .

#install dependencies
RUN npm install

#copy remaining of files
COPY . .

#set default port
EXPOSE 5000

#command to run app
CMD [ "npm", "run", "dev" ]