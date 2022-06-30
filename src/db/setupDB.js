import File from "./models/File.js";
import Function from "./models/Function.js";
import Testcase from "./models/Testcase.js";

async function setupDB() {
    await File.createTable();
    await Function.createTable();
    await Testcase.createTable();
}

export default setupDB;