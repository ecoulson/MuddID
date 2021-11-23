import express from "express";
import bodyParser from "body-parser";
import { getSession, setSession } from "../session";
const router = express.Router();
const parser = bodyParser.urlencoded({ extended: false });

type CallbackResponse = {
	requestId: string;
	code: string;
	state: string;
	error?: {
		message: string;
	};
};

router.post("/issuer/issuance-request-callback", parser, async (req, res) => {
	let bodyBuffer = "";
	req.on("data", (chunk) => {
		bodyBuffer += chunk;
	});
	req.on("end", async () => {
		const response = JSON.parse(bodyBuffer.toString()) as CallbackResponse;
		const sessionData = getSessionData(response);
		if (sessionData) {
			const session = await getSession(response.state);
			session.sessionData = sessionData;
			await setSession(response.state, session);
		}
		res.end();
	});
});

function getSessionData(response: CallbackResponse) {
	if (!response.code) {
		return null;
	}
	return {
		status: response.code,
		message: getMessage(response),
	};
}

function getMessage(response: CallbackResponse) {
	switch (response.code) {
		case "request_retrieved":
			return "QR Code is scanned. Waiting for issuance to complete...";
		case "issuance_successful":
			return "Credential successfully issued";
		case "issuance_error":
			return response.error!.message;
		default:
			return "Something went wrong";
	}
}

export default router;
