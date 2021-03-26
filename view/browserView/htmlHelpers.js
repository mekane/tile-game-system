const validCssRegex = /-?[_a-zA-Z]+[_a-zA-Z0-9-]*/;

export function cssSafeString(string) {
    const noSpaces = string.replace(/\s|-/g, '_');
    const cssString = noSpaces.replace(/[\W]/g, '');

    return validCssRegex.test(cssString) ? cssString : `c${cssString}`;
}
