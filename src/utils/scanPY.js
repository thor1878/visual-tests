function scanPY(fileString) {
    const functionSignatures = [
        ...(fileString.match(/[ ]*(async[ ]+)?def[ ]+\w+[ ]*\(.*?\)[ ]*\:/g) || [])
    ]

    const functions = functionSignatures.map(funcSig => getFunction(fileString, funcSig));

    return functions;
}

function getFunction(fileString, funcSig) {

    const start = fileString.indexOf(funcSig);
    let index = start;
    const funcIndent = funcSig.match(/^([ ]*)/)[1].length
    
    let char;
    let currentLine = '';
    let currentLineIndent = funcIndent;

    // Skip first line / function signature
    index = start + funcSig.length + 1;
    
    do {
        char = fileString[index];
        while (char && char !== '\n' && char !== '\r') {
            currentLine += char;
            index++;
            char = fileString[index];
        }
        currentLineIndent = currentLine.match(/^([ ]*)/)[1].length;

        currentLine = '';
        index++;
    }
    while (currentLineIndent > funcIndent)

    const end = index - 1;

    const functionString = fileString.slice(start, end);
    const name = funcSig.match(/def[ ]+(\w+)/)[1];
    const params = funcSig.match(/def[ ]+\w+[ ]*\((.*?)\)/)[1].replace(/[ ]/g, '');

    return {
        name: name,
        params: params,
        // functionString: functionString.replace(
        //     /(^|\n)([ ]*)/g, 
        //     (a, b, c) => c.slice(0, -funcIndent)
        // )
        functionString: functionString
    }
}

export default scanPY;