FROM phusion/baseimage:latest
MAINTAINER Niels Krijger <niels@kryger.nl>

# Set correct environment variables.
ENV HOME /root

CMD ["/sbin/my_init"]

# Install Node.js
RUN apt-get update && apt-get install -y --force-yes curl
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN apt-get install -y nodejs build-essential

# Add runit service for Node.js app
RUN mkdir /etc/service/app
ADD deploy/runit.sh /etc/service/app/run
RUN chmod +x /etc/service/app/run

# Bundle Node.js app source
ADD /src /app
WORKDIR /app

# Install app dependencies
RUN npm install && npm cache clear

# Add syslog-ng Logentries config file
ADD deploy/logentries.conf /etc/syslog-ng/conf.d/logentries.conf

EXPOSE  3000

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
