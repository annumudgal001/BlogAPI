document.addEventListener('DOMContentLoaded', () => {
    const allbuttons = document.querySelectorAll(".searchbtn");
    const searchbar = document.querySelector(".searchbar");
    const searchinput = document.getElementById("searchinput");
    const searchclose = document.getElementById("searchclose");
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Search bar toggle
    for (var i = 0; i < allbuttons.length; i++) {
        allbuttons[i].addEventListener('click', function() {
            searchbar.style.visibility = 'visible';
            searchbar.classList.add('open');
            this.setAttribute('aria-expanded', 'true');
            searchinput.focus();
        });
    }

    if (searchclose) {
        searchclose.addEventListener('click', () => {
            searchbar.style.visibility = 'hidden';
            searchbar.classList.remove('open');
            allbuttons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
        });
    }

    // Theme toggle
    if (themeToggle) {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-theme');
            const isDark = body.classList.contains('dark-theme');
            themeToggle.querySelector('i').classList.toggle('fa-moon', !isDark);
            themeToggle.querySelector('i').classList.toggle('fa-sun', isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
});