import { Router } from "express"
import { TextOperationController } from "../Controllers/TextOperationController"
import { TokenValidationMiddleware } from "../Middlewares/TokenValidationMiddleware"
import { TextOperationValidator } from "../Middlewares/Validators/TextOperationValidator"

/**
 * Defines routes for text operations
 */
export class TextOperationRoutes {
	/**
	 * Initializes routes for token operations
	 * 
	 * @returns {Router} The router
	 */
	static init () {
		const router = Router()

		router.post(
			"/justify",
			TokenValidationMiddleware.use,
			TextOperationValidator.justify(),
			TextOperationController.justify
		)

		return router
	}
}