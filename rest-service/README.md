# REST Service

The Pulse system REST Service

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migration

```bash
# create new migration file
$ npm run typeorm:cli -- migration:create -n CreateStatusTable   # Creates a migration file with the class name of CreateStatusTable

# run pending migrations
$ npm run typeorm:cli -- migration:run

# revert the last migration
$ npm run typeorm:cli -- migration:revert

# show migration status
$ npm run typeorm:cli -- migration:show

# drop all tables in current schema. use with caution 🤓
$ npm run typeorm:cli -- schema:drop
```
