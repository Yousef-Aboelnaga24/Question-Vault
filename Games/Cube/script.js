document.addEventListener("DOMContentLoaded", () => {
  let questions = JSON.parse(localStorage.getItem('cubeQuestions')) || [];
  let isDragging = false;
  let isQuestionOpen = false;
  let canOpen = true;
  let currentQuestion = null;
  let rotationX = -30, rotationY = 45;
  let startX, startY;
  let isClosing = false;
  let rotationInterval;

  const cube = document.querySelector('.cube');
  const topFace = document.querySelector('.cube-face.top');
  const questionEl = document.querySelector('.question');
  const addQuestionBtn = document.getElementById('addQuestionBtn');
  const toggleManagerBtn = document.getElementById('toggleManager');
  const managerContent = document.querySelector('.manager-content');
  const questionsList = document.getElementById('questionsList');
  const questionManager = document.getElementById('questionManager');

  function saveQuestions() {
    localStorage.setItem('cubeQuestions', JSON.stringify(questions));
    updateQuestionsList();
  }

  function updateQuestionsList() {
    questionsList.innerHTML = "";
    questions.forEach((q, index) => {
      const li = document.createElement('li');
      li.className = 'd-flex justify-content-between align-items-center';
      li.innerHTML = `
        <span>${q.question}</span>
        <button class="btn btn-sm deleteQuestion" data-index="${index}">
          <i class="fa fa-trash"></i>
        </button>
      `;
      questionsList.appendChild(li);
    });

    document.querySelectorAll('.deleteQuestion').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.currentTarget.getAttribute('data-index');
        questions.splice(index, 1);
        saveQuestions();
      });
    });
  }

  function addQuestion() {
    const newQuestionInput = document.getElementById('newQuestion');
    const newAnswerInput = document.getElementById('newAnswer');
    const newQ = newQuestionInput.value.trim();
    const newA = newAnswerInput.value.trim();

    if (newQ && newA) {
      const isDuplicate = questions.some(q => q.question === newQ);
      if (isDuplicate) {
        Swal.fire({
          icon: 'warning',
          title: 'تنبيه',
          text: 'هذا السؤال تم إضافته مسبقاً',
          confirmButtonText: 'حاضر'
        });
      } else {
        questions.push({ question: newQ, answer: newA });
        saveQuestions();
        newQuestionInput.value = '';
        newAnswerInput.value = '';
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'الرجاء إدخال السؤال والإجابة',
        confirmButtonText: 'حاضر'
      });
    }
  }

  addQuestionBtn.addEventListener('click', addQuestion);
  addQuestionBtn.addEventListener('touchstart', addQuestion);

  toggleManagerBtn.addEventListener('click', () => {
    if (managerContent.style.display === 'none') {
      managerContent.style.display = 'block';
      toggleManagerBtn.textContent = 'Hide questions list';
    } else {
      managerContent.style.display = 'none';
      toggleManagerBtn.textContent = 'Show questions list';
    }
  });

  function openCube() {
    clearTimeout(rotationInterval);
    topFace.classList.remove('top-close');
    topFace.classList.add('top-open');

    if (questions.length === 0) {
      questionEl.textContent = "لا توجد أسئلة";
      return;
    }

    currentQuestion = questions[Math.floor(Math.random() * questions.length)];
    questionEl.textContent = currentQuestion.question;

    const faces = ['front', 'back', 'left', 'right', 'bottom'];
    const randomFace = faces[Math.floor(Math.random() * faces.length)];
    const faceTransforms = {
      front: 'translate(-50%, -50%) translateZ(145px) rotateX(0deg) scale(0.5)',
      back: 'translate(-50%, -50%) translateZ(-145px) rotateX(0deg) scale(0.5)',
      left: 'translate(-50%, -50%) translateX(-145px) rotateY(90deg) scale(0.5)',
      right: 'translate(-50%, -50%) translateX(145px) rotateY(-90deg) scale(0.5)',
      bottom: 'translate(-50%, -50%) translateY(145px) rotateX(-90deg) scale(0.5)'
    };
    const finalTransform = 'translate(-50%, -50%) translateZ(0px) rotateX(0deg) scale(1)';

    questionEl.style.transition = 'none';
    questionEl.style.opacity = '0';
    questionEl.style.transform = faceTransforms[randomFace];
    void questionEl.offsetWidth;
    questionEl.style.transition = 'transform 0.8s ease-in-out, opacity 0.8s ease-in-out';
    questionEl.style.transform = finalTransform;
    questionEl.style.opacity = '1';
  }

  function showAnswer() {
    if (!currentQuestion) return;
    questionEl.textContent = currentQuestion.answer;
  }

  function hideAnswerAndCloseCube() {
    questionEl.style.transition = 'all 0.8s ease-in-out';
    questionEl.style.transform = 'translate(-50%, -50%) translateZ(145px) rotateX(0deg) scale(0.5)';
    questionEl.style.opacity = '0';
    topFace.classList.remove('top-open');
    topFace.classList.add('top-close');

    canOpen = false;
    setTimeout(() => {
      topFace.classList.remove('top-close');
      setTimeout(() => canOpen = true, 3000);
    }, 1000);
  }

  cube.addEventListener('click', () => {
    if (isDragging || isClosing || !canOpen) return;
    if (!isQuestionOpen) {
      openCube();
      isQuestionOpen = true;
    } else {
      showAnswer();
      isClosing = true;
      setTimeout(() => {
        hideAnswerAndCloseCube();
        isQuestionOpen = false;
        isClosing = false;
      }, 4000);
    }
  });

  function startDrag(e) {
    clearTimeout(rotationInterval);
    isDragging = true;
    startX = e.pageX || e.touches[0].pageX;
    startY = e.pageY || e.touches[0].pageY;
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
  }

  function drag(e) {
    if (!isDragging) return;
    const x = e.pageX || e.touches[0].pageX;
    const y = e.pageY || e.touches[0].pageY;
    const deltaX = x - startX;
    const deltaY = y - startY;
    startX = x;
    startY = y;
    rotationY += deltaX * 0.5;
    rotationX -= deltaY * 0.5;
    rotationX = Math.max(-180, Math.min(180, rotationX));
    cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
  }

  cube.addEventListener('mousedown', startDrag);
  cube.addEventListener('touchstart', startDrag);

  // سحب لوحة الأسئلة باللمس فقط
  let isDraggingManager = false;
  let managerStartX, managerStartY, initialLeft, initialTop;

  questionManager.addEventListener('touchstart', (e) => {
    isDraggingManager = true;
    managerStartX = e.touches[0].clientX;
    managerStartY = e.touches[0].clientY;
    initialLeft = parseInt(window.getComputedStyle(questionManager).left, 10);
    initialTop = parseInt(window.getComputedStyle(questionManager).top, 10);
    e.preventDefault();
  });

  questionManager.addEventListener('touchmove', (e) => {
    if (!isDraggingManager) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    questionManager.style.left = `${initialLeft + (currentX - managerStartX)}px`;
    questionManager.style.top = `${initialTop + (currentY - managerStartY)}px`;
    e.preventDefault();
  });

  questionManager.addEventListener('touchend', () => {
    isDraggingManager = false;
  });

  updateQuestionsList();
});

let themeDark = document.getElementById('dark')
let themeWhite = document.getElementById('white')

window.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('darkMod');
        themeDark.style.display = 'none';
        themeWhite.style.display = 'block';
    } else {
        document.body.classList.add('whiteMod');
        themeDark.style.display = 'block';
        themeWhite.style.display = 'none';
    }
});

themeDark.addEventListener('click', () => {
    document.body.classList.add('darkMod');
    document.body.classList.remove('whiteMod');
    themeDark.style.display = 'none';
    themeWhite.style.display = 'block';
    localStorage.setItem('theme', 'dark');
});

themeWhite.addEventListener('click', () => {
    document.body.classList.add('whiteMod');
    document.body.classList.remove('darkMod');
    themeDark.style.display = 'block';
    themeWhite.style.display = 'none';
    localStorage.setItem('theme', 'light');
});