# pull official base image
FROM  node:20.11.1-alpine



# set working directory
WORKDIR /app

# run tests and store results as json file
# RUN npx mocha test --exit --reporter json > test-results.txt
# RUN more public/test-results.txt

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g 


# add app
COPY . ./



# start app
CMD ["npm", "start"]
