import "reflect-metadata";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { graphqlUploadExpress } from "graphql-upload";
import { VerifierResolver } from "./resolvers/verifier";
// import annotateImage from "./annotate-image";
// const fileName = "/Users/evancoulson/Downloads/IMG_1394.jpg";
// const annotations = await annotateImage(fileName);

async function main(): Promise<void> {
	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, VerifierResolver],
			validate: false,
		}),
	});
	await apolloServer.start();

	const app = express();
	app.use(cors());
	app.use(graphqlUploadExpress());
	apolloServer.applyMiddleware({ app });
	app.listen(4000, () => {
		console.log("Server is listening on port 4000");
	});
}

main().catch(console.error);
