import { HttpNotFoundError } from "@server/infra/errors";
import { todoRepository } from "@server/repository/todo";
import { z as schema } from "zod";

async function get(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = {
    page: searchParams.get("page"),
    limit: searchParams.get("limit"),
  };
  const page = Number(query.page);
  const limit = Number(query.limit);

  if (query.page && isNaN(page)) {
    return new Response(JSON.stringify("`page` must be a number"), {
      status: 400,
    });
  }

  if (query.limit && isNaN(limit)) {
    return new Response(JSON.stringify("`limit` must be a number"), {
      status: 400,
    });
  }
  try {
    const output = await todoRepository.get({ page: page, limit: limit });

    return new Response(
      JSON.stringify({
        ages: output.pages,
        total: output.total,
        todos: output.todos,
      }),
      {
        status: 200,
      }
    );
  } catch {
    return new Response("Failed to fetch todos", {
      status: 400,
    });
  }
}
const TodoCreateBodySchema = schema.object({ content: schema.string() });

async function create(req: Request) {
  const body = TodoCreateBodySchema.safeParse(await req.json());
  if (!body.success) {
    return new Response(
      JSON.stringify("You need to provide a content to create a TODO"),
      {
        status: 400,
      }
    );
  }
  try {
    const createdTodo = await todoRepository.createdByContent(
      body.data.content
    );
    return new Response(JSON.stringify({ todo: createdTodo }), {
      status: 201,
    });
  } catch {
    return new Response(JSON.stringify("Failed to create a todo"), {
      status: 400,
    });
  }
}

async function toggleDone(uid: string) {
  if (!uid || typeof uid !== "string") {
    return new Response(
      JSON.stringify({ error: { message: "You must provide a Uid" } }),
      {
        status: 400,
      }
    );
  }

  try {
    const updatedTodo = await todoRepository.toggleDone(uid);
    return new Response(JSON.stringify({ todo: updatedTodo }), {
      status: 200,
    });
  } catch (err) {
    if (err instanceof HttpNotFoundError) {
      return new Response(JSON.stringify({ error: { message: err.message } }), {
        status: err.status,
      });
    }
  }
}

async function deleteByUid(uid: string) {
  const QuerySchema = schema.object({
    uid: schema.string().uuid().min(1),
  });
  const parsedQuery = QuerySchema.safeParse(uid);
  if (!parsedQuery.success) {
    return new Response(
      JSON.stringify({ error: { message: "You must provide a Uid" } }),
      {
        status: 400,
      }
    );
  }

  try {
    const todoUid = parsedQuery.data.uid;
    await todoRepository.deleteByUid(todoUid);
    return new Response(JSON.stringify({ message: "TODO deleted." }), {
      status: 204,
    });
  } catch (err) {
    if (err instanceof HttpNotFoundError) {
      return new Response(JSON.stringify({ error: { message: err.message } }), {
        status: err.status,
      });
    }

    return new Response(
      JSON.stringify({ error: { message: "Internal Server Error" } }),
      {
        status: 500,
      }
    );
  }
}
export const todoController = { get, create, toggleDone, deleteByUid };
