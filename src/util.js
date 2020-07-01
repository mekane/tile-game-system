function fileSafeString(string) {
    const noSpaces = string.replace(/\s|-/g, '_');
    const noSpecialChars = noSpaces.replace(/[\W]/g, '');
    return noSpecialChars.toLowerCase();
}

module.exports = {
    fileSafeString
}
