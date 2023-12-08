FROM node:16

RUN sudo apt-get update
# Update the package repository information and install necessary dependencies
RUN apt-get install libpangocairo-1.0-0 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libgconf2-4 libasound2 libatk1.0-0 libgtk-3-0
RUN sudo apt-get install -y libgbm-dev
# Set the working directory in the container
WORKDIR /maze

# Copy only the necessary files for installing dependencies
COPY package*.json ./

# Copy the entire project to the container
COPY . .

# Install Node.js dependencies
RUN npm install \
    # Clean up obsolete files:
    && rm -rf /tmp/* /root/.npm

# Build the front-end using Vite
RUN npm run build

# Expose the port on which the app will run
EXPOSE 5173

CMD ["npm", "run", "start"]
