document.addEventListener('DOMContentLoaded', () => {
    const allbuttons = document.querySelectorAll(".searchbtn");
    const searchbar = document.querySelector(".searchbar");
    const searchinput = document.getElementById("searchinput");
    const searchclose = document.getElementById("searchclose");

    for (var i = 0; i < allbuttons.length; i++) {
        allbuttons[i].addEventListener('click', function() {
            searchbar.style.visibility = 'visible';
            searchbar.classList.add('open');
            this.setAttribute('aria-expanded', 'true');
            searchinput.focus();
        });
    }

    searchbar.addEventListener('click', function() {
        searchbar.style.visibility = 'hidden';
        searchbar.classList.remove('open');
        this.setAttribute('aria-expanded', 'false');
    });
});
