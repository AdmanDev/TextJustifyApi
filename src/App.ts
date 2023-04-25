import http from "http"
import express, { Express } from "express"
import { DbService } from "./Services/DbService"
import { RouterManager } from "./Routes/RouterManager"

interface ErrorHandlerType {
	syscall: string
	code: string
}

/**
 * Defines App express setup
 */
export class App {
	static server?: http.Server
	static port: number

	/**
	 * Initializes the express server
	 */
	static init () {
		if (App.server) {
			return
		}

		//Create server
		const app = App.createExpressApp()
		App.server = http.createServer(app)

		App.server.on("listening", () => console.log(`Server started at http://localhost:${App.port}`))
		App.server.on("error", App.errorHandler)

		App.port = parseInt(process.env.PORT as string, 10) || 9000

		// Start server
		App.server.listen(App.port, App.server.address() as string)

		// Connect to database
		if (process.env.NODE_ENV !== "test") {
			DbService.initDatabase()
		}
	}

	/**
	 * Create and configure the Express app
	 * 
	 * @returns {Express} The Express application
	 */
	private static createExpressApp () {
		// Configure Express Application
		const app = express()

		app.enable("trust proxy")
		app.use((req, res, next) => {
			res.setHeader("Access-Control-Allow-Origin", "*")
			res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization")
			res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
			res.setHeader("Access-Control-Allow-Credentials", "true")
			next()
		})

		app.use(express.urlencoded({ extended: true }))
		app.use(express.json())

		//Routes
		RouterManager.init(app)

		return app
	}

	/**
	 * Handle server errors
	 * 
	 * @param {ErrorHandlerType} error The occured error
	 */
	private static errorHandler (error: ErrorHandlerType) {
		if (error.syscall !== "listen") {
			throw error
		}

		const address = `http://localhost:${App.port}`

		switch (error.code) {
			case "EACCES":
				console.error(address + " requires elevated privileges.")
				process.exit(1)
				break

			case "EADDRINUSE":
				console.error(address + " is already in use.")
				process.exit(1)
				break

			default:
				throw error
		}
	}

	/**
	 * Close server
	 */
	static stop () {
		if (App.server) {
			App.server.close()
			App.server = undefined
		}
	}

}

if (process.env.NODE_ENV !== "test") {
	App.init()
}