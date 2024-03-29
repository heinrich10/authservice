Archived... please refer to the new repo [auth-service](https://github.com/heinrich10/auth-service)

# authservice

# How to run

## HTTP API
1. execute `npm install` to install dependencies
2. execute `node index` to run the server, it will listen on port 6010

## gRPC API
1. execute `npm install` to install dependencies
2. execute `INTERFACE=grpc node index` to run the server, it will listen to port 6010

# How to run in docker

1. build the project using `docker build -t authservice:latest .`
2. once build is successful, execute `docker run -it -p 6010:6010 -d authservice:latest`
3. to use the gRPC interface, add the line `ENV INTERFACE grpc` to the Dockerfile or use `docker run -it -e INTERFACE=grpc -p 6010:6010 -d authservice:latest`

# Running the test

- to run integration, test execute `npm test:integration`
- to run unit test, execute `npm test:unit`
- to run both, execute `npm test`

# API

**GET /check**

response
```
{
    status: true
}
```

**POST /register**

request body
```
{
    "username": "user1",
    "password": "password,
}
```

response body
```
{
    "token": "alkaljv"
    "refreshToken: "asdasdasd"
}
```

**POST /login**

request body
```
{
    "username": "user1",
    "password": "password,
}
```
sample response
```
{
    "success": true
}
```

**gRPC .register**

params
```
{
    "username": "user1",
    "password": "password"
}
```

response
```
{
    "status": 201,
    "message": "success"
}
```

**gRPC .login**

params
```
{
    "username": "user1",
    "password": "password"
}
```

response
```
{
    "status": 200,
    "token": "kajlkjfldajfb",
    "refreshToken": "apjapvjp"
}
```

# Config

There are 2 settings that can be configured by supplying ENV vars:
- PORT: port where the app listens to (default: 6010). note: you have to change the `EXPOSE` on the Dockerfile.
- INTERFACE: rest or grpc (default: rest)

example: executing `PORT=3001 INTERFACE=grpc node index` will make the app listen to port 3001 and use the grpc interface

# Deployment

Prerequisites:
- kubernetes cluster
- a running ambassador instance

execute `kubectl apply -f ./deploy/deploy.yml`. you should be able to access the api endpoints with `http://${AMBASSADOR_IP}/auth/`

example: GET http://localhost/auth/check would let you check if server is running.

# Notes

- To make it simple, I did not add configuration files. If I need to add it, I would probably use `dotenv`.
- This uses `registry pattern` to inject the db.
- I used rsa256 auth type for jwt, where there is a private key to sign the issued token and a public key to verify its signature.
- I know it is not a good practice to upload the key files to the repo but this is the easiest way as of the moment.
- There are a lot of ways to manage this key file, a way I used before is aws ssm, another way could be using hashi corp vault.
- Separating unit and integration my seem trivial in this repo, but in production it makes more sense because there will be more files (even on microservices, it won't be this small).
