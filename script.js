const modal = document.getElementById("myModal");
const btn = document.getElementById("addQuestionBtn");

btn.onclick = function () {
    modal.style.display = "block";
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

function createQuestionForm() {
    const questionTemplate = document.getElementById("question-template");
    const newQuestionForm = questionTemplate.cloneNode(true);
    newQuestionForm.id = "";
    const questionCount = document.querySelectorAll(".question").length + 1;

    // Обновляем метку вопроса
    const questionLabel = newQuestionForm.querySelector(
        "label[for='question']"
    );
    questionLabel.textContent = `Вопрос ${questionCount}`;

    // Обновляем имена радио-кнопок
    const radioButtons = newQuestionForm.querySelectorAll(
        "input[type='radio']"
    );
    radioButtons.forEach((radio) => {
        radio.name = `correct${questionCount}`; // Уникальное имя для каждой группы
    });

    return newQuestionForm;
}

function updateQuestionLabels() {
    const questions = document.querySelectorAll(".question");
    questions.forEach((question, index) => {
        const questionLabel = question.querySelector("label[for='question']");
        questionLabel.textContent = `Вопрос ${index + 1}`;
    });
}

document.addEventListener("click", function (event) {
    if (event.target.classList.contains("add-question-btn")) {
        const newQuestionForm = createQuestionForm();

        document
            .querySelector(".questions-list")
            .appendChild(newQuestionForm);
    }
    if (event.target.classList.contains("remove-question-btn")) {
        const allQuestions = document.querySelectorAll(".question");
        const lastQuestion = document.querySelector(".question:last-child");

        if (allQuestions.length === 1) {
            alert("Должен оставаться хотя бы один вопрос.");
            return;
        }

        lastQuestion.parentNode.removeChild(lastQuestion);
        updateQuestionLabels();
    }
});

document.getElementById("questionForm").onsubmit = function (event) {
    event.preventDefault();
    const testTitle = document.getElementById("test-title").value;
    const questions = document.querySelectorAll(".question");
    const questionsData = [];

    questions.forEach((question, index) => {
        const questionText =
            question.querySelector("input[type='text']").value;
        const answers = question.querySelectorAll(".answer");
        const answersData = [];

        answers.forEach((answer, optionIndex) => {
            const answerText = answer.querySelector("input[type='text']").value;
            const isCorrect = answer.querySelector(
                "input[type='radio']"
            ).checked;
            answersData.push({
                id: `id${index + 1}${optionIndex + 1}`,
                text: answerText,
                correct: isCorrect,
            });
        });

        const correctAnswer = answersData.find((a) => a.correct);
        questionsData.push({
            id: `id${index + 1}`,
            question: questionText,
            correct: correctAnswer ? correctAnswer.id : null,
            options: answersData,
        });
    });

    const testData = {
        id: `id${Date.now()}`,
        title: testTitle,
        questions: questionsData,
    };

    // Отправка данных на сервер
    fetch("http://localhost:3000/tests", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
    })
        .then((response) => {
            if (response.ok) {
                console.log("Тест добавлен:", testData);
                modal.style.display = "none";
                document.getElementById("questionForm").reset();
                loadTests();
            } else {
                console.error("Ошибка при добавлении теста");
            }
        })
        .catch((error) => console.error("Ошибка:", error));
};

function loadTests() {
    fetch("http://localhost:3000/tests")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка при загрузке тестов");
            }
            return response.json();
        })
        .then((tests) => {
            const container = document.querySelector(".container");
            if (container) {
                container.innerHTML = "";
                tests.forEach((test) => {
                    container.innerHTML = container.innerHTML + `<a href="test.html?id=${test.id}" class="test-button">${test.title}</a>`;
                });
            } else {
                console.error("Элемент с классом 'container' не найден.");
            }
        })
        .catch((error) =>
            console.error("Ошибка при загрузке тестов:", error)
        );
}

window.onload = loadTests;


