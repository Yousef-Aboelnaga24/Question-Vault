document.addEventListener("DOMContentLoaded", () => {
  // تعريف المتغيرات
  let questions = JSON.parse(localStorage.getItem('cubeQuestions')) || [];

  function saveQuestions() {
    localStorage.setItem('cubeQuestions', JSON.stringify(questions));
    updateQuestionsList();  // تحديث قائمة الأسئلة بعد الحفظ
  }

  // عرض الأسئلة
  function updateQuestionsList() {
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = "";  // مسح القائمة الحالية

    questions.forEach((q, index) => {
      questionsList.innerHTML += `
        <li class="d-flex justify-content-between align-items-center">
          <span>${q.question}</span>
          <button class="btn btn-sm deleteQuestion" data-index="${index}"><i class="fa fa-trash"></i></button>
        </li>
      `;
    });

    // إضافة الأحداث لأزرار الحذف
    const deleteBtns = document.querySelectorAll('.deleteQuestion');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const index = btn.getAttribute('data-index');
        questions.splice(index, 1);
        saveQuestions(); // حفظ التعديلات
      });
    });
  }

  // عرض الأسئلة الموجودة عند تحميل الصفحة
  updateQuestionsList();

  // إضافة سؤال جديد
  const addQuestionBtn = document.getElementById('addQuestionBtn');

  addQuestionBtn.addEventListener('click', () => {
    const newQuestionInput = document.getElementById('newQuestion');
    const newAnswerInput = document.getElementById('newAnswer');
    const newQ = newQuestionInput.value.trim();
    const newA = newAnswerInput.value.trim();

    if (newQ && newA) {
      const isDuplicate = questions.some(q => q.question === newQ);
      if (isDuplicate) {
        alert('هذا السؤال تم إضافته مسبقًا');
      } else {
        questions.push({ question: newQ, answer: newA });
        saveQuestions();
        newQuestionInput.value = '';
        newAnswerInput.value = '';
      }
    } else {
      alert('الرجاء إدخال السؤال والإجابة');
    }
  });

  // إضافة حدث الـ TouchStart للموبايل
  addQuestionBtn.addEventListener('touchstart', () => {
    const newQuestionInput = document.getElementById('newQuestion');
    const newAnswerInput = document.getElementById('newAnswer');
    const newQ = newQuestionInput.value.trim();
    const newA = newAnswerInput.value.trim();

    if (newQ && newA) {
      // التحقق من تكرار السؤال
      const isDuplicate = questions.some(q => q.question === newQ);
      if (isDuplicate) {
        alert('هذا السؤال تم إضافته مسبقًا');
      } else {
        questions.push({ question: newQ, answer: newA });
        saveQuestions();
        newQuestionInput.value = '';
        newAnswerInput.value = '';
      }
    } else {
      alert('الرجاء إدخال السؤال والإجابة');
    }
  });

});


document.addEventListener("DOMContentLoaded", () => {
  let isDragging = false;
  let rotationInterval;
  let startX, startY;
  let rotationX = -30, rotationY = 45;
  let isQuestionOpen = false;
  let canOpen = true;
  // حالة عرض السؤال
  let currentQuestion = null; // يخزن السؤال الحالي مع إجابته

  const cube = document.querySelector('.cube');
  const topFace = document.querySelector('.cube-face.top');
  const questionEl = document.querySelector('.question');

  // زر تبديل إظهار/إخفاء إدارة الأسئلة
  const toggleManagerBtn = document.getElementById('toggleManager');
  const managerContent = document.querySelector('.manager-content');
  toggleManagerBtn.addEventListener('click', () => {
    if (managerContent.style.display === 'none') {
      managerContent.style.display = 'block';
      toggleManagerBtn.textContent = 'Hide questions list';
    } else {
      managerContent.style.display = 'none';
      toggleManagerBtn.textContent = 'Show questions list';
    }
  });

  // مجموعة أسئلة افتراضية وتحميلها من localStorage

  let questions = JSON.parse(localStorage.getItem('cubeQuestions')) || [];

  function saveQuestions() {
    localStorage.setItem('cubeQuestions', JSON.stringify(questions));
    updateQuestionsList();
  }


  function updateQuestionsList() {
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = "";
    questions.forEach((q) => {
      questionsList.innerHTML += `
      <li class="d-flex justify-content-between align-items-center">
          <span>${q.question}</span>
          <button class="btn btn-sm deleteQuestion"><i class="fa fa-trash"></i></button>
        </li>
      `;
      let deleteBtns = document.querySelectorAll('.deleteQuestion');
      deleteBtns.forEach((btn, index) => {
        btn.addEventListener('click', function () {
          questions.splice(index, 1);
          saveQuestions();
          updateQuestionsList();
        });
      });

    });
  }

  updateQuestionsList();
  document.getElementById('addQuestionBtn').addEventListener('click', () => {
    const newQuestionInput = document.getElementById('newQuestion');
    const newAnswerInput = document.getElementById('newAnswer');
    const newQ = newQuestionInput.value.trim();
    const newA = newAnswerInput.value.trim();
    if (newQ && newA) {
      questions.push({ question: newQ, answer: newA });
      saveQuestions();
      newQuestionInput.value = '';
      newAnswerInput.value = '';
    }
  });



  const faceTransforms = {
    front: 'translate(-50%, -50%) translateZ(145px) rotateX(0deg) scale(0.5)',
    back: 'translate(-50%, -50%) translateZ(-145px) rotateX(0deg) scale(0.5)',
    left: 'translate(-50%, -50%) translateX(-145px) rotateY(90deg) scale(0.5)',
    right: 'translate(-50%, -50%) translateX(145px) rotateY(-90deg) scale(0.5)',
    bottom: 'translate(-50%, -50%) translateY(145px) rotateX(-90deg) scale(0.5)'
  };
  const finalTransform = 'translate(-50%, -50%) translateZ(0px) rotateX(0deg) scale(1)';

  // فتح المكعب وعرض سؤال عشوائي (وتوقيف التدوير التلقائي)
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

    questionEl.style.transition = 'none';
    questionEl.style.opacity = '0';
    questionEl.style.transform = faceTransforms[randomFace];

    // فرض إعادة التدفق
    void questionEl.offsetWidth;

    questionEl.style.transition = 'transform 0.8s ease-in-out, opacity 0.8s ease-in-out';
    questionEl.style.transform = finalTransform;
    questionEl.style.opacity = '1';
  }


  // عرض الإجابة عند الضغطة الثانية
  function showAnswer() {
    if (!currentQuestion) return;
    questionEl.textContent = currentQuestion.answer;
  }

  // إخفاء الإجابة وغلق المكعب واستئناف التدوير التلقائي بعد 5 ثوانٍ

  function hideAnswerAndCloseCube() {
    questionEl.style.transition = 'all 0.8s ease-in-out';
    questionEl.style.transform = faceTransforms.front;
    questionEl.style.opacity = '0';
    topFace.classList.remove('top-open');
    topFace.classList.add('top-close');

    canOpen = false;

    setTimeout(() => {
      topFace.classList.remove('top-close');

      setTimeout(() => {
        canOpen = true;
      }, 3000);


    }, 1000);
  }



  let isClosing = false;
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


  // وظائف السحب للمكعب
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

  cube.addEventListener('keydown', (e) => {
    const rotationStep = 10;
    if (e.key === 'ArrowLeft') {
      rotationY -= rotationStep;
    } else if (e.key === 'ArrowRight') {
      rotationY += rotationStep;
    } else if (e.key === 'ArrowUp') {
      rotationX -= rotationStep;
    } else if (e.key === 'ArrowDown') {
      rotationX += rotationStep;
    }
    cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  });

  // إمكانية سحب لوحة إدارة الأسئلة باللمس
  const questionManager = document.getElementById('questionManager');
  let isDraggingManager = false;
  let managerStartX, managerStartY;
  let initialLeft, initialTop;

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
    const deltaX = currentX - managerStartX;
    const deltaY = currentY - managerStartY;
    questionManager.style.left = `${initialLeft + deltaX}px`;
    questionManager.style.top = `${initialTop + deltaY}px`;
    e.preventDefault();
  });

  questionManager.addEventListener('touchend', () => {
    isDraggingManager = false;
  });
});
// إمكانية سحب لوحة إدارة الأسئلة باللمس
const questionManager = document.getElementById('questionManager');
let isDraggingManager = false;
let managerStartX, managerStartY;
let initialLeft, initialTop;

// أحداث اللمس
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
  const deltaX = currentX - managerStartX;
  const deltaY = currentY - managerStartY;
  questionManager.style.left = `${initialLeft + deltaX}px`;
  questionManager.style.top = `${initialTop + deltaY}px`;
  e.preventDefault();
});

questionManager.addEventListener('touchend', () => {
  isDraggingManager = false;
});

// أحداث الماوس لإضافة دعم على أجهزة الكمبيوتر
questionManager.addEventListener('mousedown', (e) => {
  isDraggingManager = true;
  managerStartX = e.clientX;
  managerStartY = e.clientY;
  initialLeft = parseInt(window.getComputedStyle(questionManager).left, 10);
  initialTop = parseInt(window.getComputedStyle(questionManager).top, 10);
});

document.addEventListener('mousemove', (e) => {
  if (!isDraggingManager) return;
  const currentX = e.clientX;
  const currentY = e.clientY;
  const deltaX = currentX - managerStartX;
  const deltaY = currentY - managerStartY;
  questionManager.style.left = `${initialLeft + deltaX}px`;
  questionManager.style.top = `${initialTop + deltaY}px`;
});

document.addEventListener('mouseup', () => {
  isDraggingManager = false;
});


function openCube() {
  console.log('تم الضغط على المكعب، إيقاف التدوير التلقائي');
  // إيقاف الحركة التلقائية عند الضغط
  clearTimeout(rotationInterval);
  cancelAnimationFrame(autoRotateAnimationId);

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
  questionEl.style.transition = 'none';
  questionEl.style.opacity = '0';
  questionEl.style.transform = faceTransforms[randomFace];

  // إعادة التدفق
  void questionEl.offsetWidth;

  questionEl.style.transition = 'c vall 0.8s ease-in-out';
  questionEl.style.transform = finalTransform;
  questionEl.style.opacity = '1';
}

function hideAnswerAndCloseCube() {
  questionEl.style.transition = 'all 0.8s ease-in-out';
  questionEl.style.transform = faceTransforms.front;
  questionEl.style.opacity = '0';
  topFace.classList.remove('top-open');
  topFace.classList.add('top-close');
  setTimeout(() => {
    topFace.classList.remove('top-close');
    // استئناف التدوير التلقائي بعد اختفاء الإجابة

  }, 1000);
}

// Dark Mode
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
