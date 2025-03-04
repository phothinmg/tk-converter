import type { MatterResult } from "./types";

import { load } from "js-yaml";

type DataProps = {
	lines: string[];
	metaIndices: number[];
};

/**
 * Finds indices of lines in a markdown file that contain a metadata delimiter.
 * @param mem An array of indices to be populated.
 * @param item A line of the markdown file.
 * @param i The index of the line in the markdown file.
 * @returns The updated array of indices.
 */
function findMetaIndices(mem: number[], item: string, i: number): number[] {
	// If the line starts with ---, it's a metadata delimiter
	if (/^---/.test(item)) {
		// Add the index of the line to the array of indices
		mem.push(i);
	}

	return mem;
}

/**
 * Extracts and parses metadata from a markdown file.
 *
 * @param linesPros An object containing `lines` and `metaIndices` properties.
 * - `lines`: An array of strings representing lines of a markdown file.
 * - `metaIndices`: An array of numbers marking the start and end of the metadata block.
 *
 * @returns A JSON object containing the parsed metadata if present, otherwise an empty object.
 */
function getData(linesPros: DataProps) {
	const { lines, metaIndices } = linesPros;
	if (metaIndices.length > 0) {
		const dat = lines.slice(metaIndices[0] + 1, metaIndices[1]);
		const data = load(dat.join("\n"));
		return data;
	}
	return {};
}

/**
 * Returns the content of a markdown file as a string, optionally
 * skipping over a metadata block.
 *
 * If the file contains a metadata block, the content will be
 * everything after the second `---` delimiter. Otherwise, the
 * content will be the entire file.
 *
 * @param linesPros An object with `lines` and `metaIndices` properties.
 * @returns A string containing the content of the markdown file.
 */
function getContent(linesPros: DataProps): string {
	const { lines, metaIndices } = linesPros;
	return metaIndices.length > 0
		? lines.slice(metaIndices[1] + 1).join("\n")
		: lines.join("\n");
}

/**
 * Extracts frontmatter data from a markdown string.
 *
 * @param mdcontent A string that contains markdown content.
 * @returns An object with two properties: data and content.
 * - data: A JSON object that contains the frontmatter data,
 *   parsed from the markdown string.
 * - content: A string that contains the remainder of the
 *   markdown content after the frontmatter has been stripped.
 */
export function mymatter<T = Record<string, any>>(
	mdcontent: string,
): MatterResult<T> {
	const lines = mdcontent.split("\n");
	const metaIndices = lines.reduce(findMetaIndices, [] as number[]);
	const data = getData({ lines, metaIndices }) as T;
	const content: string = getContent({ lines, metaIndices });

	return { data, content };
}
