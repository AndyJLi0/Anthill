# AntHill

Authors: Andy Li, Austin Zhu, Kira Potter, Ryan Wang


## Description

**AntHill** is an educational program that aims to provide an introduction to first-year level coding students who have recently learned syntax and basic principles. We provide code snippets without comments or names to describe behaviour, and students enter Plain English descriptions of the snippet. Ollama, (specifically the Code Llama model), will generate code based on the student’s response. This code is then run against pre-written tests, which provides the student with slight feedback until they successfully complete the problem.

## Run using Docker

## Running the React App in Docker

1. **Navigate to directory**:

   ```
   cd anthill
   ```
2. **Build the Docker image**:
   ```
   docker build -t anthill:test .
   ```

3. **Run the Docker container**:
   ```
   docker run -it --rm -p 3001:3000 anthill:test
   ```

4. **Access the applicatio**n:
  Open your web browser and go to http://localhost:3001 to see your React app running.
