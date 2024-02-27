import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";
import { z as schema } from "zod";

interface TodoControllerGetParams {
    page: number;
}
async function get(params: TodoControllerGetParams) {
    return todoRepository.get({ page: params.page, limit: 2 });
}

function filterTodosbyContent<T>(
    todos: Array<T & { content: string }>,
    search: string
): T[] {
    const homeTodos = todos.filter((todo) => {
        const searchNormalized = search.toLocaleLowerCase();
        const contentNormalized = todo.content.toLocaleLowerCase();
        return contentNormalized.includes(searchNormalized);
    });

    return homeTodos;
}
interface TodoControllerCreateParams {
    content?: string;
    onError: () => void;
    onSuccsess: (todo: Todo) => void;
}
function create({ content, onError, onSuccsess }: TodoControllerCreateParams) {
    const parsedParams = schema.string().min(1).safeParse(content);

    if (!parsedParams.success) {
        onError();
        return;
    }
    todoRepository
        .createByContent(parsedParams.data)
        .then((newTodo) => {
            onSuccsess(newTodo);
        })
        .catch(() => {
            onError();
        });
}

interface TodoControllerToggleDoneParams {
    uid: string;
    updateTodoOnScreen: () => void;
    onError: () => void;
}
function toggleDone({
    uid,
    updateTodoOnScreen,
    onError,
}: TodoControllerToggleDoneParams) {
    // updateTodoOnScreen();
    todoRepository
        .toggleDone(uid)
        .then(() => {
            updateTodoOnScreen();
        })
        .catch(() => {
            onError();
        });
}
export const todoController = { get, filterTodosbyContent, create, toggleDone };
