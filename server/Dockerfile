# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /server

# add `/server/node_modules/.bin` to $PATH
ENV PATH /server/node_modules/.bin:$PATH

# install server dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g 
RUN npm install chai
RUN npm install mocha

# add server
COPY . ./

# start server
CMD ["npm", "start"]