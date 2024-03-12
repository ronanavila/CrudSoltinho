export async function GET() {
  return new Response(JSON.stringify({ message: "Olá mundo!" }), {
    status: 200,
  });
}

// import { NextApiRequest, NextApiResponse } from "next";
// export default async function handler(
//   request: NextApiRequest,
//   response: NextApiResponse
// ) {
//   await response.status(200).json({ message: "OlaMundo" });
// }
