export type MatterResult<T = Record<string, any>> = {
	/**
	 *  Yaml data form a markdown files
	 */
	data: T;
	/**
	 * Body content of markdown file
	 */
	content: string;
};
