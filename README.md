[![Build Status](https://travis-ci.com/Ijebusoma/driveway.svg?branch=master)](https://travis-ci.com/Ijebusoma/driveway)
[![Coverage Status](https://coveralls.io/repos/github/Ijebusoma/driveway/badge.svg?branch=master)](https://coveralls.io/github/Ijebusoma/driveway?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/096f2fe8410a40d90637/maintainability)](https://codeclimate.com/github/Ijebusoma/driveway/maintainability)

# Driveway

A simple Node JS API that allows users (admin) to manage parking spaces.

## Core Technologies

- [Nodejs](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Postgres](https://www.postgresql.org/)
- [Sequelize ORM](https://sequelize.org/)
- [Mocha](https://mochajs.org/)
- [Chai](https://www.chaijs.com/)

### To get started

1. Install Node.js
2. [Install Yarn](https://yarnpkg.com/lang/en/docs/install/#mac-stable) package manager

3. Clone the repo by running `git clone https://github.com/Ijebusoma/driveway.git`

4. CD into the root of the project directory
5. Run `yarn install` or on the terminal to get all needed dependencies
6. Run `yarn run test:server` to ensure the app is not broken
7. Create a .env file in the root directory of the app. An example of the content in the .env file can be found here .env.example

8. Once the set up is complete, to start the application run `yarn run start:server`

### Endpoints

Access to endpoints are restricted based on the authorization token assigned to the user.
The token is automatically generated when a new user signs up and when a returning user signs in.
