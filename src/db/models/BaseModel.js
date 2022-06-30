import db from "../db.js";

class BaseModel {
    constructor() {
        this.columnNames = Object.keys(this.constructor.columns);
        this.constraints = this.constructor.constraints;
    }
    
    static async get(filter) {
        const result = await db.manyOrNone(
            `SELECT *
            FROM $1:name
            WHERE $2:value = $3`,
            [this.name.toLowerCase(), Object.keys(filter)[0], Object.values(filter)[0]]
        )

        return result.map(res => new this(...Object.values(res)));
    }

    static async createTable() {
        const formattedColumns = Object.entries(this.columns).map(col => col[0] + ' ' + col[1]);
        const constraints = this.constraints ? ',' + this.constraints.toString() : '';
        await db.none(
            `CREATE TABLE IF NOT EXISTS $1:name (
                id SERIAL PRIMARY KEY,
                $2:value
            )`,
            [this.name.toLowerCase(), formattedColumns.toString() + constraints]
        )
    }

    async save() {
        const result = await db.one(
            `INSERT INTO $1:name ($2:value)
            VALUES ($3:csv)
            RETURNING id`,
            [this.constructor.name.toLowerCase(), this.columnNames.toString(), this.columnNames.map(c => this[c])]
        )
        this.id = result.id;
    }
}

export default BaseModel;