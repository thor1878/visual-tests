import fetch from 'node-fetch';

export async function getJSON(url, token) {
    const response = await fetch(url, {
        method: 'get',
        headers: {
            'Authorization': `token ${token}`
        }
    });
    return await response.json();
}