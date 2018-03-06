# promo-front
This repo contains an Angular.js application which consumes data from the Express server app in my `promo-back` repository. 

## Important Notes
Take into account that this application has been developed ONLY for my own personal training purposes so it is NOT fit for use in a production environment.

This Angular1.x app was created to consume resources from a Node RESTful API application (back-end) which will run on a different server. Go to my [`promo-back`](https://github.com/Albertoatx/promo-back) repo and follow the instructions to install it BEFORE running this front-end Angular1.x app.

## Installation and Running of this Angular1.x App

Download or clone this repo.

Install `http-server` globally so that you can serve the app using a simple web server:

```bash
npm install -g http-server
```

Then navigate inside the `client` folder and start the server:
```bash
http-server
```

The Angular1.x app will be served at http://127.0.0.1:8080

Note: There is NO need to install any dependencies for this AngularJs app, all of them are locally stored inside the 'bower_components' folder.

## About the app

After starting the app you will be sent to the 'home' page.

In that 'home' page you must create an user account if you still don't have one.

With that user account you will be able to 'login' in the app (that will create a session in the back-end) and use most of the functionalities provided by the back-end app in the `promo-back` repo.

The list of users in the app, their deletion or edition can only be done using an 'admin' account.
