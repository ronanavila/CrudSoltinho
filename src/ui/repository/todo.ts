import { z as schema } from "zod";
import { Todo, TodoSchema } from "@ui/schema/todo";

interface TodoRepositoryGetParams {
    page: number;
    limit: number;
}

interface TodoRepositoryGetOutput {
    todos: Todo[];
    total: number;
    pages: number;
}

function get({
    page,
    limit,
}: TodoRepositoryGetParams): Promise<TodoRepositoryGetOutput> {
    return fetch(`/api/todos?page=${page}&limit=${limit}`).then(
        async (serverResponse) => {
            const todosString = await serverResponse.text();
            const parsedResponse = parseTodosFromServer(
                JSON.parse(todosString)
            );
            return {
                todos: parsedResponse.todos,
                total: parsedResponse.total,
                pages: parsedResponse.pages,
            };
        }
    );
}
async function createByContent(content: string): Promise<Todo> {
    const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content,
        }),
    });
    if (response.ok) {
        const serverResponse = await response.json();
        const serverResponseSchema = schema.object({ todo: TodoSchema });
        const serverResponseParsed =
            serverResponseSchema.safeParse(serverResponse);

        if (!serverResponseParsed.success) {
            throw new Error("Failed to create a new TODO");
        }
        return serverResponseParsed.data.todo;
    }
    throw new Error("Failed to create a new TODO");
}

export const todoRepository = { get, createByContent };

function parseTodosFromServer(responseBody: unknown): {
    total: number;
    pages: number;
    todos: Todo[];
} {
    if (
        responseBody !== null &&
        typeof responseBody === "object" &&
        "todos" in responseBody &&
        "total" in responseBody &&
        "pages" in responseBody &&
        Array.isArray(responseBody.todos)
    ) {
        return {
            total: Number(responseBody.total),
            pages: Number(responseBody.pages),
            todos: responseBody.todos.map((todo: unknown) => {
                if (todo === null && typeof todo !== "object") {
                    throw new Error("INvalid todo from API");
                }

                const { uid, content, done, date } = todo as {
                    uid: string;
                    content: string;
                    date: string;
                    done: string;
                };

                return {
                    uid,
                    content,
                    done: String(done).toLowerCase() === "true",
                    date: date,
                };
            }),
        };
    }
    return { pages: 1, total: 0, todos: [] };
}
