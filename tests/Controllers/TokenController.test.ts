import supertest from "supertest"
import { TokenService } from "../../src/Services/TokenService"
import { App } from "../../src/App"
import { CreateTokenRequest } from "../../src/Models/Request/CreateTokenRequest"
import { Exception } from "../../src/Models/Exception/Exception"
import { GetTokenRequest } from "../../src/Models/Request/GetTokenRequest"
import { MockHelpers } from "../TestHelpers/MockHelpers"

describe("TokenController tests", () => {

	beforeAll(() => {
		App.init()
	})

	afterAll(() => {
		App.stop()
	})

	describe("createToken endpoint", () => {
		const apiEndpoint = "/api/token/create"

		it("should return a valid token", async () => {
			// Arrange
			const token = "1234567890"
			const request: CreateTokenRequest = {
				email: "foo@bar.com"
			}

			jest.spyOn(TokenService, "createToken").mockResolvedValue(token)

			// Act
			const res = await supertest(App.server)
				.post(apiEndpoint)
				.send(request)

			// Assert
			expect(res.status).toBe(200)
			expect(res.body.isError).toBeFalsy()
			expect(res.body.value).toBe(token)
		})

		it("should return an error if the email is missing", async () => {
			// Act
			const res = await supertest(App.server)
				.post(apiEndpoint)
				.send()

			// Assert
			expect(res.status).toBe(400)
			expect(res.body.isError).toBeTruthy()
		})

		it("should return an error if TokenService.createToken throws an error", async () => {
			// Arrange
			const error = new Exception("An error occurred", 500)
			const request: CreateTokenRequest = {
				email: "foo@bar.com"
			}

			jest.spyOn(TokenService, "createToken")
				.mockRejectedValue(error)

			// Act
			const res = await supertest(App.server)
				.post(apiEndpoint)
				.send(request)

			// Assert
			expect(res.status).toBe(error.statusCode)
			expect(res.body.isError).toBeTruthy()
		})
	})

	describe("getTokenByEmail endpoint", () => {
		const apiEndpoint = "/api/token"

		it("should return a valid token for a valid email", async () => {
			// Arrange
			const token = MockHelpers.getTokenInstance()

			const request: GetTokenRequest = {
				email: token.email
			}

			jest.spyOn(TokenService, "getTokenByEmail").mockResolvedValue(token)

			// Act
			const res = await supertest(App.server)
				.post(apiEndpoint)
				.send(request)

			// Assert
			expect(res.status).toBe(200)
			expect(res.body.isError).toBeFalsy()
			expect(res.body.value).toBe(token.token_value)
		})

		it("should return an error if the email is missing", async () => {
			// Act
			const res = await supertest(App.server)
				.post(apiEndpoint)
				.send()

			// Assert
			expect(res.status).toBe(400)
			expect(res.body.isError).toBeTruthy()
		})

		it("should return an error if TokenService.getTokenByEmail throws an error", async () => {
			// Arrange
			const error = new Exception("An error occurred", 500)
			const request: GetTokenRequest = {
				email: "foo@bar.com"
			}

			jest.spyOn(TokenService, "getTokenByEmail")
				.mockRejectedValue(error)

			// Act
			const res = await supertest(App.server)
				.post(apiEndpoint)
				.send(request)

			// Assert
			expect(res.status).toBe(error.statusCode)
			expect(res.body.isError).toBeTruthy()
		})
	})

})