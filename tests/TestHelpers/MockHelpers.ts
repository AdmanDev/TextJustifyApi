import { TokenValidationMiddleware } from "../../src/Middlewares/TokenValidationMiddleware"
import { Token } from "../../src/Models/DB/Token"

/**
 * Defines a set of helper methods for mocking objects.
 */
export class MockHelpers {

	/**
	 * Mocks token validation middleware.
	 * 
	 * @returns {global.jest.SpyInstance} The mocked middleware
	 */
	public static mockTokenValidationMiddleware() {
		const mock = jest.spyOn(TokenValidationMiddleware, "use")
		mock.mockImplementation(async (req, res, next) => {
			req.token = MockHelpers.getTokenInstance()
			next()
		})

		return mock
	}

	/**
	 * Gets a token instance.
	 * 
	 * @returns {Token} The token instance
	 */
	public static getTokenInstance() {
		const token: Token = {
			id: 1,
			email: "foo@bar.com",
			token_value: "123456789",
			last_word_count_reset_date: new Date(),
			used_worlds_count: 0,
		}

		return token
	}

}