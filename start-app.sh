cd anthill &&
npx mocha test --exit --reporter json > public/test-results.txt &&
cd ../server &&
npx mocha test --exit --reporter json > test-results.txt &&
docker compose up -d