# Use a Node.js image with Vite
FROM node:18 as builder

# Set the working directory in the container
WORKDIR /maze

# Copy only the necessary files for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Build the front-end using Vite
RUN npm run build

# Expose the port on which the app will run
EXPOSE 5173

CMD ["npm", "run", "start"]
