FROM node:18.14.2
WORKDIR /my_app
ADD package.json /my_app/package.json 
COPY . /my_app/
RUN npm install --force
CMD [ "sh", "-c", "npm start" ]
EXPOSE 4000
# RUN yarn build

# FROM node:10.15.3-alpine
# WORKDIR /todo_api
# COPY --from=builder /todo_api ./
# RUN yarn install --production=true
# EXPOSE 8080
# ENTRYPOINT ["yarn", "serve"]
