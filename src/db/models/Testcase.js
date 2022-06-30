import BaseModel from "./BaseModel.js";

class Testcase extends BaseModel {
    static columns = {
        description: 'VARCHAR NOT NULL',
        args: 'VARCHAR NOT NULL',
        matcher: 'VARCHAR NOT NULL',
        exptected: 'VARCHAR NOT NULL',
        passed: 'VARCHAR NOT NULL',
        function_id: 'INT NOT NULL'
    }
    static constraints = [
        'FOREIGN KEY (function_id) REFERENCES function(id)'
    ]

    constructor(id, description, args, matcher, exptected, passed, function_id) {
        super();
        this.id = id;
        this.description = description;
        this.args = args;
        this.matcher = matcher;
        this.exptected = exptected;
        this.passed = passed;
        this.function_id = function_id;
    }
}

export default Testcase;