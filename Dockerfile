FROM node:16-alpine

WORKDIR /app

# COPY package.json yarn.lock ./
COPY package.json package-lock.json ./
RUN npm install

COPY next.config.js ./next.config.js
COPY pages ./pages
COPY public ./public
COPY styles ./styles
COPY scripts ./scripts
COPY artifacts ./artifacts

COPY config.js ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
# COPY . .

CMD [ "npm", "run", "dev" ]
