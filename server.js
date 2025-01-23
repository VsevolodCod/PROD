const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

let tests = [];

// Загрузка тестов из файла, если он существует
if (fs.existsSync('tests.json')) {
    const data = fs.readFileSync('tests.json');
    tests = JSON.parse(data);
}

// Получение всех тестов
app.get('/tests', (req, res) => {
    res.json(tests);
});

// Добавление нового теста
app.post('/tests', (req, res) => {
    const newTest = req.body;

    // Проверка на наличие данных
    if (!newTest || !newTest.title || !Array.isArray(newTest.questions) || newTest.questions.length === 0) {
        console.error('Invalid test data:', newTest);
        return res.status(400).send('Invalid test data. Must include title and questions.');
    }

    tests.push(newTest);

    // Попытка записи в файл с обработкой ошибок
    try {
        fs.writeFileSync('tests.json', JSON.stringify(tests, null, 2));
        console.log('Test saved successfully:', newTest);
    } catch (error) {
        console.error('Error saving test:', error);
        return res.status(500).send('Error saving test');
    }

    res.status(201).send('Test added');
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


