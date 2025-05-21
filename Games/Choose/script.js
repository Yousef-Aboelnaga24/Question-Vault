let addBtn = document.getElementById('add-btn');
let removeBtn = document.getElementById('clear-btn');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('next-btn');
const resultElement = document.getElementById('result');

let answered = false;
let currentQuestion = 0;
const questions = [];

let storeQuestion = localStorage.getItem('questions');
if (storeQuestion) {
    questions.push(...JSON.parse(storeQuestion));
    removeBtn.classList.remove('d-none');
}

if (questions.length > 0) {
    questions.sort(() => Math.random() - 0.5);
    showQuestion();
}

addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let answerInp = document.getElementById('answer').value.trim()
    let questionInp = document.getElementById('questions').value.trim()
    let optionsInp = document.getElementById('option').value.trim()

    if (questionInp === '' || answerInp === '' || optionsInp === '') {
        swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'يرجى ملء جميع الحقول!',
            confirmButtonText: 'حسناً'
        })
        return;
    }

    let option = optionsInp.split(",").map(opt => opt.trim()).filter(opt => opt.length > 0);

    if (!option.includes(answerInp)) {
        swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'الإجابة الصحيحة يجب أن تكون ضمن الخيارات!',
            confirmButtonText: 'حسناً'
        })
        return;
    }

    questions.push({
        question: questionInp,
        options: option,
        correctAnswer: answerInp
    })

    localStorage.setItem('questions', JSON.stringify(questions));

    swal.fire({
        icon: 'success',
        title: 'نجاح',
        text: 'تم إضافة السؤال بنجاح!',
        timer: 1050,
        showConfirmButton: false
    })

    document.getElementById('answer').value = '';
    document.getElementById('questions').value = '';
    document.getElementById('option').value = '';

    if (questions.length === 1) {
        currentQuestion = 0;
        removeBtn.classList.remove('d-none');
        showQuestion();
    }
})

removeBtn.addEventListener('click', () => {
    if (questions.length === 0) {
        removeBtn.classList.add('d-none');
    }
    swal.fire({
        title: 'هل أنت متأكد؟',
        text: "سيتم مسح جميع الأسئلة!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم, امسحها!'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('questions');
            questions.length = 0;
            currentQuestion = 0;
            questionElement.textContent = "لا توجد أسئلة متاحة!";
            optionsElement.innerHTML = "";
            nextButton.classList.add("d-none");
            swal.fire(
                'تم!',
                'تم مسح جميع الأسئلة.',
                'success'
            )
        }
    })
})

function showQuestion() {
    if (questions.length === 0) {
        optionsElement.innerHTML = "";
        questionElement.textContent = "لا توجد أسئلة متاحة!";
        nextButton.classList.add("d-none");
        showEnd();
        return;
    }

    resultElement.textContent = "";
    nextButton.classList.add("d-none");

    answered = false;

    let q = questions[currentQuestion];
    questionElement.textContent = q.question;
    optionsElement.innerHTML = "";

    q.options.forEach(option => {
        let button = document.createElement("button");
        button.className = "btn btn-outline-primary btn-lg m-1";
        button.textContent = option;
        button.addEventListener("click", () => selectAnswer(option));
        optionsElement.appendChild(button);
    });
}

function selectAnswer(selectedOption) {
    if (answered) return;
    answered = true;

    const optionButtons = optionsElement.querySelectorAll("button");
    optionButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === questions[currentQuestion].correctAnswer) {
            btn.classList.add("btn-success");
        } else if (btn.textContent === selectedOption && selectedOption !== questions[currentQuestion].correctAnswer) {
            btn.classList.add("btn-danger");
        }
    });

    let correct = questions[currentQuestion].correctAnswer;
    if (selectedOption === correct) {
        resultElement.textContent = "إجابة صحيحة!";
        resultElement.style.color = "green";
    } else {
        resultElement.textContent = `إجابة خاطئة! الإجابة الصحيحة: ${correct}`;
        resultElement.style.color = "red";
    }
    nextButton.classList.remove("d-none");
}

nextButton.addEventListener("click", () => {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showEnd();
    }
});

function showEnd() {
    questionElement.textContent = "انتهت اللعبة!";
    optionsElement.innerHTML = "";
    nextButton.classList.add("d-none");

    document.querySelectorAll('.restart-btn').forEach(btn => { btn.remove() });

    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Restart Game";
    restartBtn.className = "btn btn-warning mt-3 restart-btn";
    restartBtn.addEventListener("click", () => {
        currentQuestion = 0;
        questions.sort(() => Math.random() - 0.5);
        localStorage.setItem('questions', JSON.stringify(questions));
        showQuestion();
        restartBtn.remove();
    });

    resultElement.textContent = '';
    resultElement.appendChild(restartBtn);
}
