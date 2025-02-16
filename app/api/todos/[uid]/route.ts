import { todoController } from "@server/controller/todo";

export async function DELETE({ params }: { params: { uid: string } }) {
  return await todoController.deleteByUid(params.uid);
}

// import { todoController } from "@server/controller/todo";
// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(
//   request: NextApiRequest,
//   response: NextApiResponse
// ) {
//   if (request.method === "DELETE") {
//     await todoController.deleteByUid(request, response);
//     return;
//   }
//   response.status(405).json({ error: { message: "Method not allowed" } });
// }
