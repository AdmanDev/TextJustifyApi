import { body } from "express-validator"
import { Validator } from "./Validator"

/**
 * Defines validators for text operations requests
 */
export class TextOperationValidator {
	/**
	 * Validates the justify request
	 * 
	 * @returns {any[]} The validators
	 */
	static justify () {
		return [
			body().isString().withMessage("Text must be a string").notEmpty().withMessage("Text must not be empty"),
			Validator.validate
		]
	}
}