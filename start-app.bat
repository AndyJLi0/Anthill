cd /d anthill
npm install
npx mocha test --exit --reporter json > public/test-results.txt

cd /d ..\server
npm install
npx mocha test --exit --reporter json > test-results.txt

docker compose up -d

pause