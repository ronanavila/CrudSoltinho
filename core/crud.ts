import fs from "fs";

const DB_PATH = "./core/db";

interface Todo {
    date: string;
    content: string;
    done: boolean;
}

function create(content: string) {
    const todo: Todo = {
        date: new Date().toISOString(),
        content: content,
        done: false
    }

    const todos: Todo[] = [...read(), todo]
    fs.writeFileSync(DB_PATH, JSON.stringify({ todos }, null, 2))
}

function read(): Array<Todo> {
    const dbSrting = fs.readFileSync(DB_PATH, "utf-8")
    const db = JSON.parse(dbSrting || "{}");
    if (!db.todos) {

        return [];
    }
    return db.todos;
}

function CLEAR_DB() {
    fs.writeFileSync(DB_PATH, "")
}

CLEAR_DB()
create("asd")
create("asd")
create("asd")


console.log(read())