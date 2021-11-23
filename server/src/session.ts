import session from "express-session";

type Session = session.SessionData & {
	sessionData?: {
		status: number | string;
		message: string;
	};
};

export const Session = new session.MemoryStore();

export const hasSession = (sessionId: string) => {
	return new Promise<boolean>((resolve, reject) => {
		Session.get(sessionId, (error, session) => {
			if (error) {
				return reject(error);
			}
			return resolve(session !== undefined && session !== null);
		});
	});
};

export const getSession = (sessionId: string) => {
	return new Promise<Session>((resolve, reject) => {
		Session.get(sessionId, (error, session) => {
			if (error) {
				return reject(error);
			}
			if (!session) {
				return reject(new Error("Session could not be found"));
			}
			return resolve(session);
		});
	});
};

export const setSession = (sessionId: string, session: Session) => {
	return new Promise<boolean>((resolve, reject) => {
		Session.set(sessionId, session, (error) => {
			if (error) {
				return reject(error);
			}
			return resolve(true);
		});
	});
};
