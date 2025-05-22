import { NextApiRequest, NextApiResponse } from "next";
import { ApolloServer } from "apollo-server-micro";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/schema";

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { requestId } = req.query;
    if (!requestId) {
      return res.status(400).json({ error: "requestId is required" });
    }

    try {
      const result = await apolloServer.executeOperation({
        query: `
          mutation ApproveUpdateRequest($requestId: Int!) {
            approveUpdateRequest(requestId: $requestId) {
              id
              weight
            }
          }
        `,
        variables: { requestId: parseInt(requestId as string, 10) },
      });

      if (result.errors) {
        return res.status(400).json({ error: result.errors });
      }

      return res.status(200).json({ message: "Solicitud aprobada exitosamente" });
    } catch (error) {
      return res.status(500).json({ error: "Error al aprobar la solicitud" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}