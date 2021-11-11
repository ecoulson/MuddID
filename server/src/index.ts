import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { graphqlUploadExpress } from "graphql-upload";
import { VerifierResolver } from "./resolvers/verifier";
import { createConnection } from "typeorm";
import { DigitalId } from "./entities/DigitalId";
import { IdResolver } from "./resolvers/id";
import AWSImagesRouter from "./routes/aws-images"

async function main(): Promise<void> {
	createConnection({
		type: "postgres",
		database: "mudd_id_verification",
		username: "postgres",
		password: "postgres",
		logging: true,
		synchronize: true,
		entities: [DigitalId],
	});

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, VerifierResolver, IdResolver],
			validate: false,
		}),
		context: ({ req, res }) => ({ req, res }),
	});
	await apolloServer.start();

	const app = express();
	app.use(cors());
	app.use(graphqlUploadExpress());
	app.use("/aws", AWSImagesRouter)

	apolloServer.applyMiddleware({ app });

	app.listen(4000, () => {
		console.log("Server is listening on port 4000");
	});
}

main().catch(console.error);
