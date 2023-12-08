# The FROM instruction initializes a new build stage and sets the Base Image for subsequent instructions
# alpine will serve as the base image
FROM alpine

# The RUN instruction will execute any commands in a new layer on top of the current image and commit the results
# apk is the package manager for alpine based images
# using that installing necessary packages
RUN apk --no-cache add \
    build-base\
    python3\
    nodejs \
    npm \
    ffmpeg \
    && npm install -g \
    npm@6.14.9 \
    # Clean up obsolete files:
    && rm -rf \
    /tmp/* \
    /root/.npm
RUN apk add --no-cache gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libnss3 lsb-release xdg-utils wget ca-certificates
# The WORKDIR instruction sets the working directory for any RUN, CMD, ENTRYPOINT, COPY and ADD 
# instructions that follow it in the Dockerfile.
WORKDIR /usr/lib/wdio

# The COPY instruction copies new files or directories from <src> and 
# adds them to the filesystem of the container at the path <dest>.
COPY package.json /usr/lib/wdio

COPY package-lock.json /usr/lib/wdio

# Installing all the dependecies present in the package.json file
RUN npm install \
    # Clean up obsolete files:
    && rm -rf \
    /tmp/* \
    /root/.npm

# Copying all the source code into the folder
COPY . /usr/lib/wdio

# An ENTRYPOINT allows you to configure a container that will run as an executable.
ENTRYPOINT [ "npm", "run" ]

# The main purpose of a CMD is to provide default commands to an executing container
CMD ["test"]