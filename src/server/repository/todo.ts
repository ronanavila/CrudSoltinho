import {
    read,
    create,
    update,
    deleteById as dbDeleteByID,
} from "@db-crud-todo";
import { HttpNotFoundError } from "@server/infra/errors";

interface TodoRepositoryGetParams {
    page?: number;
    limit?: number;
}
interface TodoRepositoryGetOutput {
    todos: Todo[];
    total: number;
    pages: number;
}

function get({
    page,
    limit,
}: TodoRepositoryGetParams = {}): TodoRepositoryGetOutput {
    const currentPage = page || 1;
    const currentLimit = limit || 10;
    const ALL_TODOS = read().reverse();

    const startIndex = (currentPage - 1) * currentLimit;
    const endINdex = currentPage * currentLimit;
    const paginatedTodos = ALL_TODOS.slice(startIndex, endINdex);
    const totalPages = Math.ceil(ALL_TODOS.length / currentLimit);

    return {
        todos: paginatedTodos,
        total: ALL_TODOS.length,
        pages: totalPages,
    };
}
async function createdByContent(content: string): Promise<Todo> {
    const newTodo = create(content);
    return newTodo;
}

async function toggleDone(uid: string): Promise<Todo> {
    const todo = read().find((todo) => todo.uid === uid);
    if (!todo) throw new HttpNotFoundError(`Todo with id ${uid} not found`);
    const updatedTodo = update(todo.uid, { done: !todo.done });
    return updatedTodo;
}

async function deleteByUid(uid: string) {
    const todo = read().find((todo) => todo.uid === uid);
    if (!todo) throw new HttpNotFoundError(`Todo with id ${uid} not found`);
    dbDeleteByID(uid);
}
export const todoRepository = {
    get,
    createdByContent,
    toggleDone,
    deleteByUid,
};

interface Todo {
    uid: string;
    content: string;
    date: string;
    done: boolean;
}
