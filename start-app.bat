cd /d anthill
npx mocha test --exit --reporter json > public/test-results.txt

cd /d ..\server
npx mocha test --exit --reporter json > test-results.txt

docker compose up -d

pause