import { TextOperation } from "../../src/Services/TextOperation"

describe("TextOperation tests", () => {
	describe("#Justify", () => {
		it("should return an empty string when given an empty string", () => {
			const result = TextOperation.justify("")
			expect(result).toEqual("")
		})

		it("should return the same string when given a string with length less than or equal to 80", () => {
			const input = "This is a short string."
			const result = TextOperation.justify(input)
			expect(result).toEqual(input)
		})

		it("should evenly distribute spaces when given a string with length more than 80", () => {
			const input = "This is a string with different word lengths. This is a longer string to test the justify function."
			const expected = "This  is  a  string with different word lengths. This is a longer string to test\nthe justify function."
			const result = TextOperation.justify(input)
			expect(result).toEqual(expected)
		})

	})

})