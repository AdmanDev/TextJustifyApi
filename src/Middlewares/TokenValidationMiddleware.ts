import { NextFunction, Request, Response } from "express"
import { Exception } from "../Models/Exception/Exception"
import { TokenService } from "../Services/TokenService"

/**
 * Defines the token validation middleware.
 */
export class TokenValidationMiddleware {
	private static maxWordsAllowed = parseInt(process.env.MAX_WORDS_ALLOWED_PER_DAY as string, 10)

	/**
	 * Validates the token and verifies if used words count is not exceeded.
	 * 
	 * @param {Request} req The request
	 * @param {Response} res The response
	 * @param {NextFunction} next The next function
	 */
	public static async use (req: Request, res: Response, next: NextFunction) {
		try {
			const auth = req.headers.authorization
			if (!auth) {
				throw new Exception("Missing token", 401)
			}

			const tokenValue = auth.split(" ")[1]

			let token = await TokenService.getTokenByValue(tokenValue)

			if (!token) {
				throw new Exception("Token not found", 404)
			}

			token = await TokenService.tryResetToken(token)

			const wordsCountAvailable = TokenValidationMiddleware.maxWordsAllowed - token.used_worlds_count
			const text: string = req.body

			if (wordsCountAvailable <= text.length) {
				throw new Exception("Payment Required", 402)
			}

			req.token = token
			next()

		} catch (error: unknown) {
			Exception.sendErrorResponse(res, error)
		}
	}

}