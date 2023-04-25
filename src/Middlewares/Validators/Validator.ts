import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import { Exception } from "../../Models/Exception/Exception"

/**
 * Defines a request validator middleware
 */
export class Validator {
	/** 
	 * Validate the request or send validation errors message
	 * 
	 * @param {Request} req The request
	 * @param {Response} res The response
	 * @param {NextFunction} next The next middleware function
	 */
	static validate (req: Request, res: Response, next: NextFunction) {
		const errors = validationResult(req)
		if (errors.isEmpty()) {
			next()
			return
		}

		const extractedErrors = errors
			.array()
			.filter(err => err.msg !== "Invalid value")
			.map(err => err.msg).join("\u000A")

		Exception.sendErrorResponse(res, new Exception(extractedErrors, 400))
	}
}