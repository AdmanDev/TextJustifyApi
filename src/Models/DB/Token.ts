export interface Token {
	id: number
	email: string
	token_value: string
	used_worlds_count: number
	last_word_count_reset_date: Date
}