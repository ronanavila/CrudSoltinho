async function get() {
    return fetch("/api/todos").then(async (serverResponse) => {
        const todosString = await serverResponse.text();
        const convertedTodos = JSON.parse(todosString).todos;
        return convertedTodos;
    });
}

export const todoController = { get };
