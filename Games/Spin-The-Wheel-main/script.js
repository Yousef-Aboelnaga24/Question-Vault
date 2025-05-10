function randomColor() {
    return {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255)
    };
}

function toRad(deg) {
    return deg * (Math.PI / 180.0);
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}

function getPercent(input, min, max) {
    return (((input - min) * 100) / (max - min)) / 100;
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

const centerX = width / 2;
const centerY = height / 2;
const radius = width / 2;

let items = document.getElementsByTagName("textarea")[0].value.split("\n");
let currentDeg = 0;
let step = 360 / items.length;
let colors = [];
let itemDegs = {};

for (let i = 0; i < items.length + 1; i++) {
    colors.push(randomColor());
}

function createWheel() {
    let textarea = document.getElementsByTagName("textarea")[0]
    if (textarea.value.trim() !== '') {

        items = textarea.value.split("\n").filter(item => item.trim() !== '');
        step = 360 / items.length;
        colors = [];
        for (let i = 0; i < items.length + 1; i++) {
            colors.push(randomColor());
        }
        draw();
    } else {
        items = [];
        draw();
    }
}

draw();

function draw() {
    const textarea = document.getElementsByTagName("textarea")[0];
    items = textarea.value.split("\n").filter(item => item.trim() !== '');

    ctx.clearRect(0, 0, width, height);

    if (items.length === 0) {
        return;
    }

    step = 360 / items.length;

    let startDeg = currentDeg;
    itemDegs = {};

    for (let i = 0; i < items.length; i++, startDeg += step) {
        const color = colors[i];
        const colorStyle = `rgb(${color.r},${color.g},${color.b})`;
        const endDeg = startDeg + step;

        // Outer ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
        ctx.fillStyle = `rgb(${color.r - 30},${color.g - 30},${color.b - 30})`;
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // Inner ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius - 30, toRad(startDeg), toRad(endDeg));
        ctx.fillStyle = colorStyle;
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // Text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(toRad((startDeg + endDeg) / 2));
        ctx.textAlign = "center";
        ctx.fillStyle = (color.r > 150 || color.g > 150 || color.b > 150) ? "#000" : "#fff";
        ctx.font = 'bold 20px sans-serif';
        ctx.shadowBlur = 4;
        ctx.fillText(items[i], 130, 10);
        ctx.restore();

        itemDegs[items[i]] = {
            startDeg: startDeg,
            endDeg: endDeg
        };
    }
}


let speed = 0;
let maxRotation = randomRange(360 * 3, 360 * 6);
let pause = false;

let selectedItem = "";
function animate() {
    if (pause) return;

    speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
    if (speed < 0.01) {
        speed = 0;
        pause = true;
        textarea.disabled = false

        let modal = new bootstrap.Modal(document.getElementById('resultModal'));
        modal.show();
        document.getElementById("winner").innerText = selectedItem;
        return;
    }

    currentDeg += speed;
    draw();
    window.requestAnimationFrame(animate);
}

const textarea = document.getElementsByTagName("textarea")[0]
function spin() {
    if (speed !== 0) return;

    createWheel();
    if (items.length === 0) {
        swal.fire({
            icon: 'warning',
            title: 'تنبية',
            text: 'من فضلك املأ القائمة!',
            confirmButtonText: 'حاضر'
        })
        return;
    }

    textarea.disabled = true;

    maxRotation = 0;
    currentDeg = 0;

    const randomIndex = Math.floor(Math.random() * items.length);
    selectedItem = items[randomIndex];
    const selectedDeg = (itemDegs[selectedItem].startDeg + itemDegs[selectedItem].endDeg) / 2;
    maxRotation = (360 * 6) - selectedDeg + 10;

    pause = false;
    window.requestAnimationFrame(animate);
}

document.querySelector("textarea").addEventListener("input", () => {
    createWheel();
});

let removeBtn = document.getElementById('remove');
removeBtn.addEventListener('click', function () {
    let textarea = document.getElementsByTagName("textarea")[0];
    let lines = textarea.value.split('\n').filter(line => line.trim() !== '');

    let updatedLines = lines.filter(item => item.trim() !== selectedItem.trim());

    textarea.value = updatedLines.join('\n');

    let modalEl = document.getElementById('resultModal');
    let modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    createWheel();
});
// -----------------------------------------
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