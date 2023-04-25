import { Response } from "express"
import { RequestResponse } from "../Request/RequestResponse"

/**
 * Defines the exception class for the application.
 */
export class Exception extends Error {
	public statusCode: number

	/**
	 *  Initializes a new exception
	 * 
	 * @param {string} message The exception message
	 * @param {number} statusCode The exception status code
	 */
	constructor (message: string, statusCode = 500) {
		super(message)
		this.statusCode = statusCode
	}

	/**
	 *  Sends the exception response
	 * 
	 * @param {Response} res The response
	 * @param {unknown} error The error
	 */
	static sendErrorResponse (res: Response, error: unknown) {
		let message = "Une erreur est survenue"
		let statusCode = 500

		if (error instanceof Exception) {
			message = error.message
			statusCode = error.statusCode
		}

		const result: RequestResponse<null> = {
			isError: true,
			message
		}

		res.status(statusCode).json(result)
	}

}