import { Request, Response } from "express"
import { CreateTokenRequest } from "../Models/Request/CreateTokenRequest"
import { TokenService } from "../Services/TokenService"
import { RequestResponse } from "../Models/Request/RequestResponse"
import { Exception } from "../Models/Exception/Exception"
import { GetTokenRequest } from "../Models/Request/GetTokenRequest"

/**
 * Defines the token controller
 */
export class TokenController {

	/**
	 * Creates a token for the given email
	 * 
	 * @param {Request} req The request
	 * @param {Response} res The response
	 */
	public static async createToken (req: Request, res: Response) {
		try {
			const { email }: CreateTokenRequest = req.body

			const token = await TokenService.createToken(email)
			const result: RequestResponse<string> = {
				isError: false,
				value: token
			}

			res.status(200).send(result)

		} catch (error: unknown) {
			Exception.sendErrorResponse(res, error)
		}
	}

	/**
	 * Gets the token for the given email
	 * 
	 * @param {Request} req The request
	 * @param {Response} res The response
	 */
	public static async getTokenByEmail (req: Request, res: Response) {
		try {
			const { email }: GetTokenRequest = req.body

			const token = await TokenService.getTokenByEmail(email)

			if (!token) {
				throw new Exception("Token not found", 404)
			}

			const result: RequestResponse<string> = {
				isError: false,
				value: token.token_value
			}

			res.status(200).send(result)

		} catch (error: unknown) {
			Exception.sendErrorResponse(res, error)
		}
	}

}