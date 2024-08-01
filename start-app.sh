#!/bin/bash

# Run tests in anthill directory
cd anthill
npx mocha test --exit --reporter json > public/test-results.txt

# Go back to root directory
cd ../server

# Run tests in server directory
npx mocha test --exit --reporter json > test-results.txt

# Start Docker
docker compose up -d