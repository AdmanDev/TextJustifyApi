import { Request, Response } from "express"
import { Exception } from "../Models/Exception/Exception"
import { TextOperation } from "../Services/TextOperation"
import { TokenService } from "../Services/TokenService"

/**
 * Define the text operations controller
 */
export class TextOperationController {

	/**
	 * Justifies the given text
	 * 
	 * @param {Request} req The request
	 * @param {Response} res The response
	 */
	public static async justify (req: Request, res: Response) {
		try {
			const text: string = req.body
			const justifiedText = TextOperation.justify(text)

			await TokenService.consumeToken(req.token.id, text.length)

			res.status(200).type("text/plain").send(justifiedText)

		} catch (error: unknown) {
			Exception.sendErrorResponse(res, error)
		}
	}

}