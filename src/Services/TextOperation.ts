/**
 * Defines text operations
 */
export class TextOperation {
	/**
	 * Justifies a text
	 * 
	 * @param {string} text The text to justify
	 * @returns {string} The justified text
	 */
	public static justify (text: string) {
		const maxCharsPerLine = 80
		const words = text.split(" ")
		const lines: string[] = []

		let currentLine = ""
		for (const word of words) {
			const isLineFull = currentLine.length + word.length > maxCharsPerLine
			if (word.includes("\n") || isLineFull) {
				lines.push(currentLine.trim())
				currentLine = word + " "
			} else {
				currentLine += word + " "
			}
		}

		if (currentLine) {
			lines.push(currentLine.trim())
		}

		const justifiedLines = lines.map((line, inx) => {
			if (inx === lines.length - 1) {
				return line
			}

			const wordsInLine = line.split(" ")
			const totalSpaces = 80 - line.length + wordsInLine.length - 1

			if (wordsInLine.length === 1 || totalSpaces === 0) {
				return line
			}

			const spacesBetweenWords = Math.floor(totalSpaces / (wordsInLine.length - 1))
			const extraSpaces = totalSpaces % (wordsInLine.length - 1)

			let justifiedLine = ""

			for (let i = 0; i < wordsInLine.length - 1; i++) {
				justifiedLine += wordsInLine[i]
				const spacesToAdd = i < extraSpaces ? spacesBetweenWords + 1 : spacesBetweenWords
				justifiedLine += " ".repeat(spacesToAdd)
			}

			justifiedLine += wordsInLine[wordsInLine.length - 1]
			return justifiedLine
		})

		return justifiedLines.join("\n")
	}
}