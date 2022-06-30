import { getJSON } from "./fetch.js";
import { SUPPORTED_LANGUAGES } from '../config.js';
import scanJS from "./scanJS.js";
import scanPY from "./scanPY.js";

export async function processTree(res, tree, token) {
    const files = [];

    for (const [i, obj] of tree.entries()) {
        const chunk = `${i + 1} / ${tree.length}`;
        res.write(chunk + '#delimiter#\r\n');

        if (obj.path.match(/^\.github/)) continue;

        const extension = obj.path.split('.').pop();
        if (!Object.keys(SUPPORTED_LANGUAGES).includes(extension)) continue;

        const file = {
            path: obj.path,
            language: extension
        }

        // Get file data/content
        const fileData = await getJSON(obj.url, token);
        const fileString = Buffer.from(fileData.content, 'base64').toString();
        
        // Scan file
        switch (extension.toLowerCase()) {
            case 'js': file.functions = scanJS(fileString); break;
            case 'py': file.functions = scanPY(fileString); break;
            case 'cs': file.functions = scanCS(fileString); break;
        }

        // Only push if file has identified functions
        if (Object.keys(file.functions).length > 0) files.push(file);
    }

    return files;
}


