import fs from "fs";
import { v4 as uuid } from "uuid";

const DB_PATH = "./core/db";

type UUID = string;
interface Todo {
    uid: UUID;
    date: string;
    content: string;
    done: boolean;
}

function create(content: string): Todo {
    const todo: Todo = {
        uid: uuid(),
        date: new Date().toISOString(),
        content: content,
        done: false,
    };

    const todos: Todo[] = [...read(), todo];
    fs.writeFileSync(DB_PATH, JSON.stringify({ todos }, null, 2));

    return todo;
}

function read(): Array<Todo> {
    const dbSrting = fs.readFileSync(DB_PATH, "utf-8");
    const db = JSON.parse(dbSrting || "{}");
    if (!db.todos) {
        return [];
    }
    return db.todos;
}

function update(uid: UUID, partialTodo: Partial<Todo>): Todo {
    let updatedTodo;
    const todos = read();
    todos.forEach((currentTodo) => {
        const isToUpdate = currentTodo.uid === uid;
        if (isToUpdate) {
            updatedTodo = Object.assign(currentTodo, partialTodo);
        }
    });

    fs.writeFileSync(DB_PATH, JSON.stringify({ todos }, null, 2));
    if (!updatedTodo) {
        throw new Error("Error");
    }
    return updatedTodo;
}
function updateContentById(uid: UUID, content: string): Todo {
    return update(uid, { content });
}

function deleteById(uid: UUID) {
    const todos = read();

    const todosWithoutOne = todos.filter((todo) => {
        if (todo.uid === uid) return false;

        return true;
    });

    fs.writeFileSync(
        DB_PATH,
        JSON.stringify({ todos: todosWithoutOne }, null, 2)
    );
}

function CLEAR_DB() {
    fs.writeFileSync(DB_PATH, "");
}

CLEAR_DB();
create("asd");
create("asd");
const terceira = create("asd");
const quarta = create("asd");

update(terceira.uid, { content: "aa", done: true });
updateContentById(quarta.uid, "Batman");
deleteById(quarta.uid);

console.log(read());
