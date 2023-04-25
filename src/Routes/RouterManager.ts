import express, { Express } from "express"
import { TokenRoutes } from "./TokenRoutes"
import { TextOperationRoutes } from "./TextOperationRoutes"

/**
 * Defines routes initializer
 */
export class RouterManager {
	/**
	 * Initializes all routes
	 * 
	 * @param {Express} app The express application
	 */
	static init (app: Express) {
		const textParser = express.text({ type: "text/plain" })

		app.use("/api/token", TokenRoutes.init())
		app.use("/api", textParser, TextOperationRoutes.init())
	}
}