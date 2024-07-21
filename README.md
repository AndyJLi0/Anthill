# AntHill

Authors: Andy Li, Austin Zhu, Kira Potter, Ryan Wang


## Description

**AntHill** is an educational program that aims to provide an introduction to first-year level coding students who have recently learned syntax and basic principles. We provide code snippets without comments or names to describe behaviour, and students enter Plain English descriptions of the snippet. Ollama, (specifically the Deepseek Coder v2 model), will generate code based on the student’s response. This code is then run against pre-written tests, which provides the student with slight feedback until they successfully complete the problem.

## Docker Compose

1. **Navigate to project directory**:
   ```
   cd Project-Groups-09-Lab-B
   ```

2. **Compose docker images**:
   ```
   docker compose up -d
   ```

3. **Access the application**:
   Open your web browser and navigate to http://localhost:3000/ (NOTE: this may take some time (1-2 mins) to be available).

## Run tests

1. **Navigate to server directory**:
```
cd server
```

2. **Make sure dependencies are available**
   ```
   npm install mocha chai
   npm install ollama
   ```
3. **Run the tests**
   ```
   npx mocha test
   ```
   (NOTE: one test fails if the server is already running, ignore this case unless the application is not running)

