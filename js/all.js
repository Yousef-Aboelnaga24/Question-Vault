// ----------------------------------------------------------------
// Button mode
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
// ------------------------------------------------------------
// Button top
let btnTop = document.getElementById('btnTop')
window.onscroll = function () {
    if (document.documentElement.scrollTop > 710) {
        btnTop.style.display = 'block';
    } else {
        btnTop.style.display = 'none';
    }
};
btnTop.addEventListener('click', function () {
    document.documentElement.scrollTop = 0;
});
// --------------------------------------------------------------
let btnDisplay = document.getElementById('display');
let btnHide = document.getElementById('hide');
let template = document.getElementById('createForm');

window.addEventListener('DOMContentLoaded', () => {
    let display = localStorage.getItem('display');
    
    if (display === 'display') {
        btnDisplay.style.display = 'none';
        btnHide.style.display = 'block';
        template.style.display = 'block';
    } else {
        btnHide.style.display = 'none';
        template.style.display = 'none';
    }
})

// button display
btnDisplay.addEventListener('click', function () {
    template.style.display = 'block';
    btnDisplay.style.display = 'none';
    btnHide.style.display = 'block';
    localStorage.setItem('display', 'display')
})
// button hide
btnHide.addEventListener('click', function () {
    template.style.display = 'none';
    btnHide.style.display = 'none';
    btnDisplay.style.display = 'block';
    localStorage.setItem('display', 'hide');
});
// ---------------------------------------------------------------