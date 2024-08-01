cd anthill &&
npm install &&
npx mocha test --exit --reporter json > public/test-results.txt &&
cd ../server &&
npm install &&
npx mocha test --exit --reporter json > test-results.txt &&
docker compose up -d