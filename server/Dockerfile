# pull official base image
FROM node:20.11.1-alpine



# set working directory
WORKDIR /server

# run tests and store results as json file
# RUN npx mocha test --exit --reporter json > test-results.txt
# RUN more test-results.txt

# add `/server/node_modules/.bin` to $PATH
ENV PATH /server/node_modules/.bin:$PATH

# install server dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
# RUN npm install react-scripts@3.4.1 -g 


# add server
COPY . ./



# start server
CMD ["npm", "start"]