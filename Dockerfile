FROM node:18
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm ci
COPY . /usr/src/app 
ENV PORT=3000
EXPOSE 3000
CMD ["npm","start"]
# docker build --platform=linux/amd64  -t arrin/foodcal-api:latest .