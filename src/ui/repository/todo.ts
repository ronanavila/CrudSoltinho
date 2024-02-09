interface TodoRepositoryGetParams {
    page: number;
    limit: number;
}
interface TodoRepositoryGetOutput {
    todos: Todo[];
    total: number;
    pages: number;
}
interface Todo {
    uid: string;
    content: string;
    date: Date;
    done: boolean;
}
function get({
    page,
    limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
    return fetch("/api/todos").then(async (serverResponse) => {
        const todosString = await serverResponse.text();
        const convertedTodos = JSON.parse(todosString).todos;
        const ALL_TODOS = convertedTodos;
        console.log(page);
        console.log(limit);

        const startIndex = (page - 1) * limit;
        const endINdex = page * limit;
        const paginatedTodos = ALL_TODOS.slice(startIndex, endINdex);
        const totalPages = Math.ceil(ALL_TODOS.length / limit);

        return {
            todos: paginatedTodos,
            total: ALL_TODOS.length,
            pages: totalPages,
        };
    });
}
export const todoRepository = { get };
