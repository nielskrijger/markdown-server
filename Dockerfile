FROM debian

MAINTAINER Niels Krijger <niels@kryger.nl>

# Install Node.js
RUN apt-get update && apt-get install -y --force-yes curl
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get install -y nodejs npm git

# Bundle app source
ADD /src /patterncatalog

WORKDIR /patterncatalog

# Install app dependencies
RUN npm install && npm cache clear

EXPOSE  3000
CMD ["npm", "start"]
