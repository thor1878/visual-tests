import BaseModel from "./BaseModel.js";

class Function extends BaseModel {
    static columns = {
        title: 'VARCHAR NOT NULL',
        comment: 'VARCHAR NOT NULL',
        params: 'VARCHAR NOT NULL',
        status: 'VARCHAR NOT NULL',
        function_string: 'VARCHAR NOT NULL',
        file_id: 'INT NOT NULL'
    }
    static constraints = [
        'FOREIGN KEY (file_id) REFERENCES file(id)'
    ]

    constructor(id, title, comment, params, status, function_string, file_id) {
        super();
        this.id = id;
        this.title = title;
        this.comment = comment;
        this.params = params;
        this.status = status;
        this.function_string = function_string;
        this.file_id = file_id;
    }
}

export default Function;