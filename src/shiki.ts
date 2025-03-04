import * as shiki from "shiki";
import Showdown from "showdown";

function decodeHtml(encodedString: string): string {
	const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
	const translate = {
		nbsp: " ",
		amp: "&",
		quot: '"',
		lt: "<",
		gt: ">",
	};
	return encodedString
		.replace(translate_re, (match, entity) => translate[entity])
		.replace(/&#(\d+);/gi, (match, numStr) => {
			const num = Number.parseInt(numStr, 10);
			return String.fromCharCode(num);
		});
}

const hlter = await shiki.createHighlighter({
	langs: Object.keys(shiki.bundledLanguages),
	themes: ["github-light", "github-dark"],
});

function shikiHL(code: string, lang: shiki.BuiltinLanguage): string {
	return hlter.codeToHtml(code, {
		lang: lang,
		themes: { light: "github-light", dark: "github-dark" },
	});
}

export function showdownShiki() {
	function filter(text: string, converter: Showdown.Converter, options: any) {
		const params = {
			left: "<pre><code\\b[^>]*>",
			right: "</code></pre>",
			flags: "g",
		};
		function replacement(
			wholeMatch: any,
			match: string,
			left: { match: (arg0: RegExp) => string[] },
			right: any,
		) {
			const _match = decodeHtml(match);
			const regex = /class=\"([^ \"]+)/;
			const lan = left.match(regex)?.[1] || "";
			if (!lan || lan === "") {
				return wholeMatch;
			}

			return shikiHL(_match, lan as shiki.BuiltinLanguage);
		}
		return Showdown.helper.replaceRecursiveRegExp(
			text,
			replacement,
			params.left,
			params.right,
			params.flags,
		);
	}
	return [
		{
			type: "output",
			filter: filter,
		},
	];
}

Showdown.extension("showdown-shiki", showdownShiki);
