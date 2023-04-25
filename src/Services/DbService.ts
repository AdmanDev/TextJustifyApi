import { Client, QueryResult } from "pg"

/**
 * Defines the database service for Postgres operations
 */
export class DbService {
	private static client: Client

	/**
	 * Initializes the database by creating the tables if they don't exist
	 */
	public static async initDatabase () {
		DbService.client = new Client()
		await DbService.client.connect()

		const query = `
            CREATE TABLE IF NOT EXISTS tokens (
                id SERIAL PRIMARY KEY,
                email VARCHAR(50) UNIQUE NOT NULL,
                token_value VARCHAR(50) UNIQUE NOT NULL,
                used_worlds_count INTEGER NOT NULL DEFAULT 0,
                last_word_count_reset_date TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `

		await DbService.query(query)
	}

	/**
	 * Executes a query
	 * 
	 * @param {string} query The query to execute
	 * @param {unknown[]} params The parameters to use in the query
	 * @returns {Promise<QueryResult>} The result of the query
	 */
	public static async query (query: string, params?: unknown[]) {
		return await DbService.client.query(query, params)
	}

}