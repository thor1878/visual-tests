const toggleBtn = document.querySelector('#profile-dropdown'); 
const dropdown = document.querySelector('#dropdown');

document.addEventListener('click', event => {
    if (event.composedPath().includes(toggleBtn)) {
        dropdown.classList.toggle('visible');
    } else {
        dropdown.classList.remove('visible');
    }
})