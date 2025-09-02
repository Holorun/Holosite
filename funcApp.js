const navLinks = document.querySelectorAll('.nav_link');

navLinks.forEach(navLink => {
    navLink.addEventListener('click', () => {
        document.querySelector('.active').classList.remove('active');
        navLink.classList.add('active')
    });

})
