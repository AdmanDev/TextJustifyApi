import { body } from "express-validator"
import { Validator } from "./Validator"

/**
 * Defines token request validators
 */
export class TokenRequestValidator {

	/**
	 * Validates the create token request
	 * 
	 * @returns {any[]} The validators
	 */
	public static create () {
		return [
			body("email").isEmail().withMessage("Email is not valid"),
			Validator.validate
		]
	}

	/**
	 * Validates the get token request
	 * 
	 * @returns {any[]} The validators
	 */
	public static get () {
		return [
			body("email").isEmail().withMessage("Email is not valid"),
			Validator.validate
		]
	}

}