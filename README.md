# CartConnect

CartConnect is a sharable offline first web application for sharing your personal shopping list (cart). 
Overleaf link: [Overleaf](https://de.overleaf.com/5345922844qtnhvmwsvcrw#158355)

## Online Version
Test our [WebApp](https://cart-connect.netlify.app/) and play around with it!

## Installation

### 1. Clone the repo

Clone the `syt5-gek1051-mobile-application-cartconnect` locally. In a terminal, run:

```
$ git clone https://github.com/TGM-HIT/syt5-gek1051-mobile-application-cartconnect
$ cd syt5-gek1051-mobile-application-cartconnect
```

### 2. Install the prerequisites

First, install the pre-requisites (we assume you have pre-installed [Node.js](https://nodejs.org/)):

    $ npm install

### 3. Run the server

This command serves the app at `http://127.0.0.1:8081` and provides basic URL routing for the app:

    $ npm start

### 4. Install CouchDB
You can either configure a IBM Cloudant Service ([IBM](https://console.ng.bluemix.net/)) or run the database locally with the [docker-compose](docker-compose.yml) file. Be careful: You have to create
globalchanges, replicator and users manually.

```bash
PUT /_global_changes
Content-Type: application/json

PUT /_replicator
Content-Type: application/json

PUT /_users
Content-Type: application/json
```

## Usage

Now you are able to play around with the shopping list.

## Contributing

Please refer to our [CONTRIBUTING.MD](https://github.com/TGM-HIT/syt5-gek1051-mobile-application-cartconnect/blob/main/CONTRIBUTING.md)

## License

[MIT](https://choosealicense.com/licenses/mit/)
