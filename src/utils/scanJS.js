function scanJS(fileString) {

    // console.log(fileString);
    
    const functionSignatures = [
        ...(fileString.match(/(async[ ]+)?function[ ]+\w+[ ]*\(.*?\)\s*\{/g) || []),
        ...(fileString.match(/\w+[ ]*\=[ ]*(async[ ]+)?function[ ]*\(.*?\)\s*\{/g) || []),
    ]

    const functions = [];
    for (const funcSig of functionSignatures) {
        const func = getFunction(fileString, funcSig);
        if (func) functions.push(func);
    }

    return functions;
}

function getFunction(fileString, funcSig) {

    const name = (
        funcSig.match(/(\w+)[ ]*\=/) || 
        funcSig.match(/function[ ]+(\w+)[ ]*\(/)
    )[1];
    if (!name) return;

    const start = fileString.indexOf(funcSig);
    
    let fileIndex = start + funcSig.length;
    let numUnclosedBrackets = 1;
    let inSingleQuotes = false;
    let inDoubleQuotes = false;
    let inLiteralQuotes = false;
    let inInlineComment = false;

    // Increase the fileIndex until the first bracket is closed
    while (numUnclosedBrackets > 0) {
        let char = fileString[fileIndex];
        let prevChar = fileString[fileIndex - 1] || '';

        fileIndex++;

        if (!char) continue;

        // Check if character is escaped
        if (prevChar === '\\') continue;

        if (char === '\n' || char === '\r') inInlineComment = false;
        if (inInlineComment) continue;

        // Check if character is in quotes
        switch (char) {
            case '\'': inSingleQuotes = !inSingleQuotes; break;
            case '\"': inDoubleQuotes = !inDoubleQuotes; break;
            case '\`': inLiteralQuotes = !inLiteralQuotes; break;
        }

        if (inSingleQuotes || inDoubleQuotes || inLiteralQuotes) continue

        if (char === '/' && prevChar === '/') inInlineComment = true;
        

        if (char === '{') {
            numUnclosedBrackets++;
            // console.log('{');
        } else if (char === '}') {
            numUnclosedBrackets--;
            // console.log('}');
        }
    }

    

    const end = fileIndex;

    const functionString = fileString.slice(start, end);

    const params = funcSig.match(/function.*?\((.*?)\)/)[1].replace(/[ ]/g, '');

    return {
        name: name,
        params: params,
        functionString: functionString
    }
}

export default scanJS;