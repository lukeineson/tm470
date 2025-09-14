# FROM node:18

# WORKDIR /app

# COPY package*.json ./

# # Install project dependencies, ignoring peer dep conflicts
# RUN npm install --legacy-peer-deps

# # RUN npm install --save-dev babel-preset-expo

# COPY . .

# EXPOSE 19006

# CMD ["npm", "run", "web"]


FROM node:18

WORKDIR /app

COPY package*.json ./

# Install base dependencies
RUN npm install --legacy-peer-deps

# Use expo install to ensure Expo-managed packages are on the right versions
RUN npx expo install \
  @react-native-async-storage/async-storage \
  react-native-screens \
  react-native-safe-area-context \
  react-native-gesture-handler \
  react-native-reanimated

# Copy rest of project
COPY . .

EXPOSE 19006

CMD ["npm", "run", "web"]

