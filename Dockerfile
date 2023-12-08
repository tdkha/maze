FROM node:16

RUN sudo apt-get update
# Update the package repository information and install necessary dependencies

# Set the working directory in the container
WORKDIR /maze

# Copy only the necessary files for installing dependencies
COPY package*.json ./

# Copy the entire project to the container
COPY . .

# Install Node.js dependencies
RUN npm install 

# Build the front-end using Vite
RUN npm run build

# Expose the port on which the app will run
EXPOSE 5173

CMD ["npm", "run", "start"]
