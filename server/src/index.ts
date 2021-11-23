import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import session from "express-session";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { graphqlUploadExpress } from "graphql-upload";
import { VerifierResolver } from "./resolvers/verifier";
import { createConnection } from "typeorm";
import { DigitalId } from "./entities/DigitalId";
import { IdResolver } from "./resolvers/id";
import AWSImagesRouter from "./routes/aws-images";
import IssuanceCallbackRouter from "./routes/issuance-callback";
import { Environment, getEnvironmentValue } from "./environment";
import { __prod__ } from "./constants";
import { AppContext } from "./types";
import { IssuerResolver } from "./resolvers/issuer";
import { Session } from "./session";
import { IssuanceStateResolver } from "./resolvers/issuance-state";

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
			resolvers: [
				HelloResolver,
				VerifierResolver,
				IdResolver,
				IssuanceStateResolver,
				IssuerResolver,
			],
			validate: false,
		}),
		context: ({ req, res }: AppContext) => ({ req, res }),
	});
	await apolloServer.start();

	const app = express();
	app.use(
		cors({
			origin: /http:\/\/localhost:3000|https:\/\/studio.apollographql.com/,
			credentials: true,
		})
	);
	app.use(
		session({
			store: Session,
			secret: getEnvironmentValue(Environment.SESSION_SECRET),
			resave: false,
			name: "qid",
			saveUninitialized: true,
			cookie: {
				maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
				httpOnly: true,
				sameSite: "lax",
				secure: __prod__,
			},
		})
	);
	app.use(graphqlUploadExpress());
	app.use("/aws", AWSImagesRouter);
	app.use("/api", IssuanceCallbackRouter);

	apolloServer.applyMiddleware({ app, cors: false });

	app.listen(4000, () => {
		console.log("Server is listening on port 4000");
	});
}

main().catch(console.error);
