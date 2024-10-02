# AntHill

Authors: Andy Li, Austin Zhu, Kira Potter, Ryan Wang


## Description

**AntHill** is an educational program that aims to provide an introduction to first-year level coding students who have recently learned syntax and basic principles. We provide code snippets without comments or names to describe behaviour, and students enter Plain English descriptions of the snippet. Ollama, (specifically the Deepseek Coder v2 model), will generate code based on the student’s response. This code is then run against pre-written tests, which provides the student with slight feedback until they successfully complete the problem.

## Start App (Docker Compose)

1. **Navigate to project directory**:
   ```
   cd Anthill
   ```

2. **Start application (Docker Compose runs in this step)**:
   ```
   ./start-app.sh
   ```
   For Windows Users,
   ```
   start-app.bat
   ```
   
3. **Access the application**:
   Open your web browser and navigate to http://localhost:3000/ (NOTE: this may take some time (1-2 mins) to be available).

## Run tests

1. **Start app normally**
2. **Navigate to two test pages: http://localhost:3000/test-results-anthill and http://localhost:3000/test-results-server**

Note on tests: the results are all printed. For most pertinent information, look for the "pending", "failures", and "passes" fields.
