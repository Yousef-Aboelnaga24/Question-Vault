let themeDark = document.getElementById('dark')
let themeWhite = document.getElementById('white')
let btnTop = document.getElementById('btnTop')
let spinnerWapper = document.getElementById('spinner')
// =========================================================
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
window.onscroll = function () {
    if (document.documentElement.scrollTop > 700) {
        btnTop.style.display = 'block';
    } else {
        btnTop.style.display = 'none';
    }
};
btnTop.addEventListener('click', function () {
    document.documentElement.scrollTop = 0;
});
// --------------------------------------------------------------
window.addEventListener('load', function () {
    setTimeout(() => {
        spinnerWapper.style.opacity = '0'
        setTimeout(() => {
            spinnerWapper.style.display = 'none'
        }, 1000);
    }, 2000);
})