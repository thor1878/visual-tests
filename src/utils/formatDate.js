// import config from '../config.json'
const MILLISECONDS_IN_MINUT = 1000 * 60;
const MILLISECONDS_IN_HOUR = 1000 * 60 * 60;
const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;


export function formatDate(date) {
    return new Date(date).toLocaleString('en-GB', { dateStyle: "short" })
}
export function formatTimeSince(date) {
    const timeElapsed = new Date() - new Date(date)

    const time = new Date(timeElapsed);

    if (time > MILLISECONDS_IN_DAY) return pluralize(getDays(time), 'day');
    if (time > MILLISECONDS_IN_HOUR) return pluralize(time.getHours(), 'hour');
    if (time > MILLISECONDS_IN_MINUT) return pluralize(time.getMinutes(), 'minute');
    return pluralize(time.getSeconds(), 'second');
}
function pluralize(time, unit) {
    return time + ' ' + (time === 1 ? unit : unit + 's') + ' ago';
}

function getDays(date) {
    return Math.floor(date / MILLISECONDS_IN_DAY);
}