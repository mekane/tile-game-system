function fileSafeString(string) {
    const noSpaces = string.replace(/\s|-/g, '_');
    const noSpecialChars = noSpaces.replace(/[\W]/g, '');
    return noSpecialChars.toLowerCase();
}

function generateId(type, name) {
    const prefix = fileSafeString(`${type}_${name}`);
    const number = Math.random() * 99999999;
    return `${prefix}_${number.toFixed()}`;
}

module.exports = {
    fileSafeString,
    generateId
}
