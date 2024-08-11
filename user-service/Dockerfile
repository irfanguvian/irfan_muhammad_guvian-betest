# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /usr/app

# Copy the rest of the application code
COPY . .

# Install dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]