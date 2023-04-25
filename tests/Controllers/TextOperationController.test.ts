import supertest from "supertest"
import { TokenService } from "../../src/Services/TokenService"
import { App } from "../../src/App"
import { Exception } from "../../src/Models/Exception/Exception"
import { TextOperation } from "../../src/Services/TextOperation"
import { RequestResponse } from "../../src/Models/Request/RequestResponse"
import { MockHelpers } from "../TestHelpers/MockHelpers"

describe("TextOperationController", () => {

	let mockTokenValidationMiddleware: jest.SpyInstance

	beforeAll(() => {
		mockTokenValidationMiddleware = MockHelpers.mockTokenValidationMiddleware()

		App.init()
	})

	afterAll(() => {
		App.stop()
	})

	describe("justify endpoint", () => {
		const apiEndpoint = "/api/justify"

		it("should return justified text", async () => {
			// Arrange
			const text = "This is a test text that needs to be justified."
			const justifiedText = "This   is   a   test   text  that  needs  to  be  justified."

			jest.spyOn(TokenService, "consumeToken").mockResolvedValue()
			jest.spyOn(TextOperation, "justify").mockReturnValue(justifiedText)

			// Act
			const response = await supertest(App.server)
				.post(apiEndpoint)
				.set("Content-Type", "text/plain")
				.send(text)

			// Assert
			expect(response.status).toBe(200)
			expect(response.type).toBe("text/plain")
			expect(response.text).toBe(justifiedText)
			expect(mockTokenValidationMiddleware).toBeCalled()
			expect(TokenService.consumeToken).toBeCalled()
			expect(TextOperation.justify).toHaveBeenCalledWith(text)
		})

		it("should return error when justify fails", async () => {
			// Arrange
			const text = "This is a test text that needs to be justified."
			const error = new Exception("Justify failed", 500)

			jest.spyOn(TokenService, "consumeToken").mockResolvedValue()

			jest.spyOn(TextOperation, "justify")
				.mockImplementation(() => {
					throw error
				})

			// Act
			const response = await supertest(App.server)
				.post(apiEndpoint)
				.set("Content-Type", "text/plain")
				.send(text)

			const result: RequestResponse<null> = response.body

			// Assert
			expect(response.status).toBe(error.statusCode)
			expect(result.isError).toBeTruthy()
		})

		it("should return error when text is empty", async () => {
			// Act
			const response = await supertest(App.server)
				.post(apiEndpoint)
				.set("Content-Type", "text/plain")
				.send("")

			const result: RequestResponse<null> = response.body

			// Assert
			expect(response.status).toBe(400)
			expect(result.isError).toBeTruthy()
		})

	})
})
