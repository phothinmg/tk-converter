import Showdown from "showdown";
import { mymatter } from "./matter";
import { showdownShiki } from "./shiki";
import type { MatterResult } from "./types";

const converter = new Showdown.Converter({
	tables: true,
	emoji: true,
	parseImgDimensions: true,
	ghCodeBlocks: true,
	extensions: [showdownShiki()],
	noHeaderId: true,
});

converter.setFlavor("github");

export function tkConverter<T = Record<string, any>>(
	mdcontent: string,
): { data: T; converteredHtml: string } {
	const { data, content }: MatterResult<T> = mymatter(mdcontent);
	const converteredHtml: string = converter.makeHtml(content);
	return { data, converteredHtml };
}
