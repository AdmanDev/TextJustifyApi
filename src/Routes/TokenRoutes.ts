import { Router } from "express"
import { TokenController } from "../Controllers/TokenController"
import { TokenRequestValidator } from "../Middlewares/Validators/TokenRequestValidator"

/**
 * Defines routes for token operations
 */
export class TokenRoutes {
	/**
	 * Initializes routes for token operations
	 * 
	 * @returns {Router} The router
	 */
	static init () {
		const router = Router()

		router.post("/create", TokenRequestValidator.create(), TokenController.createToken)
		router.post("/", TokenRequestValidator.get(), TokenController.getTokenByEmail)

		return router
	}
}