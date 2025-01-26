const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json());

let tests = [];

// Загрузка тестов из файла, если он существует
if (fs.existsSync("tests.json")) {
  const data = fs.readFileSync("tests.json");
  tests = JSON.parse(data);
}

// Получение всех тестов
app.get("/tests", (req, res) => {
  res.json(tests);
});

// Добавление нового теста
app.post("/tests", (req, res) => {
  const newTest = req.body;

  // Проверка на наличие данных
  if (
    !newTest ||
    !newTest.title ||
    !Array.isArray(newTest.questions) ||
    newTest.questions.length === 0
  ) {
    console.error("Invalid test data:", newTest);
    return res
      .status(400)
      .send("Invalid test data. Must include title and questions.");
  }

  tests.push(newTest);

  // Попытка записи в файл с обработкой ошибок
  try {
    fs.writeFileSync("tests.json", JSON.stringify(tests, null, 2));
    console.log("Test saved successfully:", newTest);
  } catch (error) {
    console.error("Error saving test:", error);
    return res.status(500).send("Error saving test");
  }

  res.status(201).send("Test added");
});

// Удаление теста
app.delete("/tests/:id", (req, res) => {
  const testId = req.params.id;
  tests = tests.filter((test) => test.id !== testId);
  try {
    fs.writeFileSync("tests.json", JSON.stringify(tests, null, 2));
    console.log("Test deleted successfully:", testId);
    res.status(204).send(); // Успешное удаление
  } catch (error) {
    console.error("Error deleting test:", error);
    res.status(500).send("Error deleting test");
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// const http = require('http');
// const fs = require('fs');
// const url = require('url');

// const PORT = 3000;

// let tests = [];

// // Загрузка тестов из файла, если он существует
// if (fs.existsSync('tests.json')) {
//     const data = fs.readFileSync('tests.json');
//     tests = JSON.parse(data);
// }

// const server = http.createServer((req, res) => {
//     const parsedUrl = url.parse(req.url, true);
//     const path = parsedUrl.pathname;
//     const method = req.method;

//     // Обработка CORS
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//     if (method === 'OPTIONS') {
//         res.writeHead(204);
//         res.end();
//         return;
//     }

//     if (path === '/tests' && method === 'GET') {
//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify(tests));
//     } else if (path === '/tests' && method === 'POST') {
//         let body = '';
//         req.on('data', chunk => {
//             body += chunk.toString();
//         });
//         req.on('end', () => {
//             try {
//                 const newTest = JSON.parse(body);
//                 if (!newTest || !newTest.title || !Array.isArray(newTest.questions) || newTest.questions.length === 0) {
//                     console.error('Invalid test data:', newTest);
//                     res.writeHead(400);
//                     res.end('Invalid test data. Must include title and questions.');
//                     return;
//                 }

//                 tests.push(newTest);
//                 fs.writeFileSync('tests.json', JSON.stringify(tests, null, 2));
//                 console.log('Test saved successfully:', newTest);
//                 res.writeHead(201);
//                 res.end('Test added');
//             } catch (error) {
//                 console.error('Error processing request:', error);
//                 res.writeHead(500);
//                 res.end('Error saving test');
//             }
//         });
//     } else {
//         res.writeHead(404);
//         res.end('Not Found');
//     }
// });

// server.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });