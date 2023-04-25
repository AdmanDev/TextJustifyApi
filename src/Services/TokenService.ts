import { v4 as uuidv4 } from "uuid"
import { DbService } from "./DbService"
import { DatabaseError } from "pg"
import { Exception } from "../Models/Exception/Exception"
import { Token } from "../Models/DB/Token"

/**
 * Defines the token service
 */
export class TokenService {

	/**
	 * Creates a token for the given email
	 * 
	 * @param {string} email The email to create a token for
	 * @returns {Promise<string>} The created token
	 */
	public static async createToken (email: string) {
		try {
			const token = uuidv4()
			const query = `
                INSERT INTO tokens (email, token_value)
                VALUES ($1, $2);
            `
			await DbService.query(query, [email, token])
			return token
		} catch (error: unknown) {
			if (error instanceof DatabaseError && error.code === "23505") {
				throw new Exception("Email already used", 400)
			}

			throw error
		}
	}

	/**
	 * Gets the token for the given email
	 * 
	 * @param {string} email The email to get the token for
	 * @returns {Promise<Token>} The token
	 */
	public static async getTokenByEmail (email: string) {
		const query = `
            SELECT * FROM tokens WHERE email = $1;
        `

		const result = await DbService.query(query, [email])
		return result.rows[0] as Token
	}

	/**
	 * Gets the token by its value
	 * 
	 * @param {string} value The token value
	 * @returns {Promise<Token>} The token
	 */
	public static async getTokenByValue (value: string) {
		const query = `
			SELECT * FROM tokens WHERE token_value = $1;
		`

		const result = await DbService.query(query, [value])
		return result.rows[0] as Token
	}

	/**
	 * Resets the word count for the given token if last reset date is older than 24 hours
	 *
	 * @param {Token} token The token to reset
	 * @returns {Promise<Token>} The updated token or the same token if reset was not accepted
	 */
	public static async tryResetToken (token: Token) {
		const delayToReset = parseInt(process.env.DELAY_TO_RESET_TOKEN as string, 10)
		if (token.last_word_count_reset_date.getTime() > new Date().getTime() - delayToReset) {
			return token
		}

		const query = `
			UPDATE tokens 
			SET used_worlds_count = 0, last_word_count_reset_date = NOW() 
			WHERE id = $1;
		`

		await DbService.query(query, [token.id])

		const updatedToken: Token = {
			...token,
			used_worlds_count: 0,
			last_word_count_reset_date: new Date()
		}

		return updatedToken
	}

	/**
	 * Consumes the given token by increasing the used words count
	 * 
	 * @param {number} tokenId The id of the token to consume
	 * @param {number} textLength The length of the processed text
	 */
	public static async consumeToken (tokenId: number, textLength: number) {
		const query = `
			UPDATE tokens 
			SET used_worlds_count = used_worlds_count + $1
			WHERE id = $2;
		`

		await DbService.query(query, [textLength, tokenId])
	}

}