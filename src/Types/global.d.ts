import { Token } from "../Models/DB/Token"

export { }

declare global {
	namespace Express {
		interface Request {
			token: Token
		}
	}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Any = any;
}