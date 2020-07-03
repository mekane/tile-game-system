function fileSafeString(string) {
    const noSpaces = string.replace(/\s|-/g, '_');
    const noSpecialChars = noSpaces.replace(/[\W]/g, '');
    return noSpecialChars.toLowerCase();
}

function generateId(type, name) {
    const prefix = fileSafeString(`${type}_${name}`);
    const number = [digit(), digit(), digit(), digit(), digit(), digit(), digit(), digit()].join('');
    return `${prefix}_${number}`;
}

function digit() {
    return (Math.random() * 9).toFixed();
}

module.exports = {
    fileSafeString,
    generateId
}
