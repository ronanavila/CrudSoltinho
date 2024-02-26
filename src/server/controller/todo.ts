import { todoRepository } from "@server/repository/todo";
import { NextApiRequest, NextApiResponse } from "next";
import { z as schema } from "zod";

async function get(req: NextApiRequest, res: NextApiResponse) {
    const query = req.query;
    const page = Number(query.page);
    const limit = Number(query.limit);

    if (query.page && isNaN(page)) {
        res.status(400).json({
            error: {
                message: "`page` must be a number",
            },
        });
        return;
    }

    if (query.limit && isNaN(limit)) {
        res.status(400).json({
            error: {
                message: "`limit` must be a number",
            },
        });
        return;
    }

    const output = todoRepository.get({ page: page, limit: limit });
    res.status(200).json({
        pages: output.pages,
        total: output.total,
        todos: output.todos,
    });
}
const TodoCreateBodySchema = schema.object({ content: schema.string() });

async function create(req: NextApiRequest, res: NextApiResponse) {
    const body = TodoCreateBodySchema.safeParse(req.body);
    if (!body.success) {
        res.status(400).json({
            error: {
                message: "You need to provide a content to create a TODO",
                description: body.error.issues,
            },
        });
        return;
    }
    const createdTodo = await todoRepository.createdByContent(
        body.data.content
    );
    res.status(201).json({ todo: createdTodo });
}

async function toggleDone(req: NextApiRequest, res: NextApiResponse) {
    const todoUid = req.query.uid;
    if (!todoUid || typeof todoUid !== "string") {
        res.status(400).json({ error: { message: "You must provide a Uid" } });
        return;
    }

    try {
        const updatedTodo = await todoRepository.toggleDone(todoUid);
        return res.status(200).json({ todo: updatedTodo });
    } catch (err) {
        if (err instanceof Error) {
            res.status(404).json({ error: { message: err.message } });
        }
    }
}
export const todoController = { get, create, toggleDone };
