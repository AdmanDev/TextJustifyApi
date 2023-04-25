import supertest from "supertest"
import { TokenService } from "../../src/Services/TokenService"
import { App } from "../../src/App"
import { Exception } from "../../src/Models/Exception/Exception"
import { MockHelpers } from "../TestHelpers/MockHelpers"
import { TextOperationController } from "../../src/Controllers/TextOperationController"
import { Token } from "../../src/Models/DB/Token"

describe("TokenValidationMiddleware", () => {

	const mockedToken = MockHelpers.getTokenInstance()
	let mockJustify: jest.SpyInstance
	let mockGetTokenByValue: jest.SpyInstance
	let mockTryResetToken: jest.SpyInstance

	beforeAll(() => {
		mockJustify = jest.spyOn(TextOperationController, "justify")
		mockJustify.mockImplementation((req, res) => {
			res.status(200).send("This   is   a   justified  text.")
		})

		App.init()
	})

	beforeEach(() => {
		mockGetTokenByValue = jest.spyOn(TokenService, "getTokenByValue")
		mockTryResetToken = jest.spyOn(TokenService, "tryResetToken")
	})

	afterAll(() => {
		App.stop()
	})

	describe("#Use", () => {
		const apiEndpoint = "/api/justify"
		const maxWordsAllowed = parseInt(process.env.MAX_WORDS_ALLOWED_PER_DAY as string, 10)

		it("should call next function if token and used words count are valid", async () => {
			// Arrange
			const text = "This is a test text that needs to be justified."
			const authToken = "Bearer valid_token"

			mockGetTokenByValue.mockResolvedValue(mockedToken)
			mockTryResetToken.mockResolvedValue(mockedToken)

			// Act
			const response = await supertest(App.server)
				.post(apiEndpoint)
				.set("Content-Type", "text/plain")
				.set("Authorization", authToken)
				.send(text)

			// Assert
			expect(response.status).toBe(200)
			expect(mockGetTokenByValue).toBeCalled()
			expect(mockTryResetToken).toBeCalled()
			expect(mockJustify).toBeCalled()
		})

		it("should return error if authorization header is missing", async () => {
			// Arrange
			const text = "This is a test text that needs to be justified."
			const error = new Exception("Missing token", 401)

			// Act
			const response = await supertest(App.server)
				.post(apiEndpoint)
				.set("Content-Type", "text/plain")
				.send(text)

			const result: Exception = response.body

			// Assert
			expect(response.status).toBe(error.statusCode)
			expect(result.message).toBe(error.message)
			expect(mockJustify).not.toBeCalled()
		})

		it("should return error if token is not found", async () => {
			// Arrange
			const text = "This is a test text that needs to be justified."
			const error = new Exception("Token not found", 404)
			const authToken = "Bearer invalid_token"

			mockGetTokenByValue.mockResolvedValue(null)

			// Act
			const response = await supertest(App.server)
				.post(apiEndpoint)
				.set("Content-Type", "text/plain")
				.set("Authorization", authToken)
				.send(text)

			const result: Exception = response.body

			// Assert
			expect(response.status).toBe(error.statusCode)
			expect(result.message).toBe(error.message)
			expect(mockGetTokenByValue).toBeCalledWith("invalid_token")
			expect(mockJustify).not.toBeCalled()
		})

		it("should return error if used words count is exceeded", async () => {
			// Arrange
			const text = "This is a test text that needs to be justified."
			const authToken = "Bearer valid_token"
			const error = new Exception("Payment Required", 402)
			const token: Token = {
				...mockedToken,
				used_worlds_count: maxWordsAllowed
			}

			mockGetTokenByValue.mockResolvedValueOnce(token)
			mockTryResetToken.mockResolvedValueOnce(token)

			// Act
			const response = await supertest(App.server)
				.post(apiEndpoint)
				.set("Content-Type", "text/plain")
				.set("Authorization", authToken)
				.send(text)

			const result: Exception = response.body

			// Assert
			expect(response.status).toBe(error.statusCode)
			expect(result.message).toBe(error.message)
			expect(mockJustify).not.toBeCalled()
		})
	})
})
