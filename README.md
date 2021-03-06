# Mapache Search

[![codecov](https://codecov.io/gh/ucsb-cs156-s21/proj-mapache-search/branch/main/graph/badge.svg?token=1Pm4UopT0K)](https://codecov.io/gh/ucsb-cs156-s21/proj-mapache-search)

## Purpose

This app is a course project of <https://ucsb-cs156.github.io>, a course at [UC Santa Barbara](https://ucsb.edu).

The purpose of this application is:
* to allow for searching of a class's slack archive for messages in public channels
* to provide for web searches related to software development
* to collect data about those searches

It is software to support research in software engineering education.


## Setting up GitHub Actions

To setup GitHub Actions so that the tests pass, you will need to configure
some _secrets_ on the GitHub repo settings page; see: [./docs/github-actions-secrets.md](./docs/github-actions-secrets.md) for details.

## Getting Started

To get started with this application, you'll need to be able to
* Run it locally (i.e. on localhost)
* Deploy it to Heroku
* Get the test cases running on GitHub Actions
* See aggregrated code coverage statistics on Codecov

This application has integrations with the following third-party
services that require configuration
* Auth0.com (for authentication)
* Google (for authentication)
* A postgres database provisioned on Heroku
* A MongoDB database for archived Slack Data
* A Slack bot that must be configured.

All of the setup steps for running the app on localhost and Heroku are described in these  file: 
* [./docs/SETUP-FULL.md](./docs/SETUP-FULL.md) if it is your first time setting up a Spring/React app with Auth0 and Google
* [./docs/SETUP-QUICKSTART.md](./docs/SETUP-QUICKSTART.md) if you've done these steps before.

## Setting up GitHub Actions (CI/CD, CodeCov)

To setup GitHub Actions so that the tests pass, you will need to configure
some _secrets_ on the GitHub repo settings page; see: [./docs/github-actions-secrets.md](./docs/github-actions-secrets.md) for details.

This file also describes the setup for Codecov

## MongoDB URL

You'll  need a value for the MongoDB URL for  access to the slack archive.

For students working on the project, you will typically not need to
set up your own instance of this database; instead the course staff
will do that for you.

This url is used for the value of `spring.data.mongodb.uri`


## Property file values

This section serves as a quick reference for values found in either [`secrets-localhost.properties`](./secrets-localhost.properties) and/or [`secrets-heroku.properties`](./secrets-heroku.properties).

| Property name                                                     | Heroku only? | Explanation                                                               |
| ----------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------- |
| `app.namespace`                                                   |              | See `Getting Started`                                                |
| `app.admin.emails`                                                |              | A comma separated list of email addresses of permanent admin users.       |
| `app.member.hosted-domain`                                        |              | The email suffix that identifies members (i.e. `ucsb.edu` vs `gmail.com`) |
| `app.ucsb.api.consumer_key`                                        |              | The "consumer key" from the site <https://developer.ucsb.edu>; see below for more information. |
| `spring.data.mongodb.uri` |  | The URL for read only access to the MongoDB database with archived course data; see more information below. |
| `auth0.domain`                                                    |              | See `Getting Started`                                                |
| `auth0.clientId`                                                  |              | See `Getting Started`                                                |
| `security.oauth2.resource.id`                                     |              | Should always be same as `${app.namespace}`                                   |
| `security.oauth2.resource.jwk.keySetUri`                          |              | Should always be `https://\${auth0.domain}/.well-known/jwks.json`         |
| `spring.jpa.database-platform`                                    | Yes          | Should always be `org.hibernate.dialect.PostgreSQLDialect`                |
| `spring.datasource.driver-class-name`                             | Yes          | Should always be `org.postgresql.Driver`                                  |
| `spring.jpa.properties.hibernate.temp.use_jdbc_metadata_defaults` | Yes          | Should always be `false`                                                  |
| `spring.datasource.url`                                           | Yes          | Should always be `${JDBC_DATABASE_URL}`                                   |
| `spring.datasource.username`                                      | Yes          | Should always be `${JDBC_DATABASE_USERNAME}`                              |
| `spring.datasource.password`                                      | Yes          | Should always be `${JDBC_DATABASE_PASSWORD}`                              |
| `spring.jpa.hibernate.ddl-auto`                                   | Yes          | Should always be `update`                                                 |



# Storybook Support

To run React Storybook:

* cd into `javascript`
* use: `npm run storybook`
* This should put the storybook on <http://localhost:6006>

Additional stories are added under `javascript/src/stories`

For documentation on React Storybook, see: <https://storybook.js.org/>
