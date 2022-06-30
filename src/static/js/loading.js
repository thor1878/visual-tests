const progressContainer = document.querySelector('#progress-container');
const progressCircle = document.querySelector('#progress-circle');
const progressMessage = document.querySelector('#progress-text #message'); 
const progressNumbers = document.querySelector('#progress-text #numbers'); 

window.addEventListener('load', async () => {
    progressContainer.classList.add('active');

    const q = new URLSearchParams(window.location.search);
    const message = q.get('message');

    progressMessage.textContent = message;

    const url = q.get('url');
    const dataUrl = url + '/data'

    const response = await fetch(dataUrl);

    const reader = response.body.getReader();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const data = String.fromCharCode(...value);

        const chunks = data.split(/\#delimiter\#\r\n/g);

        while (chunks.length > 0) {
            const chunk = chunks.shift();

            if (!chunk) continue;

            if (chunk.match(/^\d* \/ \d*/)) {
                updateProgressBar(chunk);
            } else {
                document.querySelector('#data').value = chunk;
            }
        }   
    }

    document.querySelector('form').submit();
})

function updateProgressBar(chunk) {
    const [ current, total ] = chunk.split(' / ');
    progressNumbers.textContent = chunk;
    progressCircle.style.background = `conic-gradient(
        #4a8fe8 ${current / total * 360}deg,
        transparent ${current / total * 360}deg
    )`
}
