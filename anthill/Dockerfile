# pull official base image
FROM  node:20.11.1-alpine


# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g 



# add app
COPY . ./
# add shared config
# COPY ./shared /shared

# create a symbolic link in the src directory (needed for the src/Components files)
# RUN ln -s ../../../shared/FirebaseConfig.js FirebaseConfig.js

# start app
CMD ["npm", "start"]
