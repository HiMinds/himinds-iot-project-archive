# himinds-iot-project-cloud-secure-rest-api

If you need a convenient way of creating a secure REST-API for test purposes, Express.js is a great match. 

Express.js is the most popular web framework for Node apps. Together with Node.js body parsing middleware body-parser which simplifies the handling of incoming request bodies it is easy to create a REST-API.


We are using the self-signed certificates we created [here](https://github.com/HiMinds/himinds-iot-project-general-self-signed-certificate). You need to copy them into the same folder as server.js.

Installing the server:

```bash
npm install
```

Running the server:

```bash
node server
```

We use curl to test the API:

```bash
curl -k -i -H  "Accept: application/json" "https://localhost:8080/api"
```


```bash
curl -k -i -H  "Accept: application/json" "https://localhost:8080/api/timestamp"
```

Output when running the code:

```bash
sudi$ curl -k -i -H  "Accept: application/json" "https://localhost:8080/api"
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 30
ETag: W/"1e-Dll0TYXHj6QkfKyBvs/Ou5X1N+E"
Date: Sat, 09 Jun 2018 16:56:26 GMT
Connection: keep-alive

{"id":1,"message":"hello API"}
```

```bash
sudi$ curl -k -i -H  "Accept: application/json" "https://localhost:8080/api/timestamp"
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 75
ETag: W/"4b-FNWTeZkzrG/fXPcBOR+zDNfjnnE"
Date: Sat, 09 Jun 2018 16:57:25 GMT
Connection: keep-alive

{"id":1234,"message":"utc timestamp","timestamp":"2018-06-09 16:57:25.389"}

```

Some great on-line versions:
* [httpbin](http://httpbin.org/)
* [jsonplaceholder](https://jsonplaceholder.typicode.com/)
* [putsreq](https://putsreq.com/)


