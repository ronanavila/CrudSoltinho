import { NextApiRequest, NextApiResponse } from "next";

import { todoController } from "@server/controller/todo";

export default function handler(
    request: NextApiRequest,
    response: NextApiResponse
) {
    if (request.method === "GET") {
        todoController.get(request, response);
    }

    response.status(405).json({ message: "Method not allowed" });
}
