import { todoRepository } from "@ui/repository/todo";
import { Todo } from "@ui/schema/todo";

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
    if (!content) {
        onError();
        return;
    }
    todoRepository
        .createByContent(content)
        .then((newTodo) => {
            onSuccsess(newTodo);
        })
        .catch(() => {
            onError();
        });
}
export const todoController = { get, filterTodosbyContent, create };
