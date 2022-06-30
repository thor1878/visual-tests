import BaseModel from "./BaseModel.js";

class File extends BaseModel {
    static columns = {
        path: 'VARCHAR NOT NULL',
        branch: 'VARCHAR NOT NULL',
        repository: 'VARCHAR NOT NULL',
        branch_id: 'INT NOT NULL'
    }

    constructor(id, path, branch, repository, branch_id) {
        super();
        this.id = id;
        this.path = path;
        this.branch = branch;
        this.repository = repository;
        this.branch_id = branch_id;
    }
}

export default File;