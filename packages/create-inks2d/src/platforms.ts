import { Platform } from "types";
import { yellow } from "kolorist";

const PLATFORMS: Platform[] = [
	{
		name: "web",
		display: "Web",
		color: yellow,
	} /*,
	{
		name: "mobile",
		display: "Mobile",
		color: green,
		variants: [
			{
				name: "mobile-android",
				display: "Android",
				color: green,
			},
		],
	},
	{
		name: "pc",
		display: "PC",
		color: cyan,
	},*/,
];

const PLATFORMS_NAMES = PLATFORMS.map(
	(f) => (f.variants && f.variants.map((v) => v.name)) || [f.name],
).reduce((a, b) => a.concat(b), []);

export { PLATFORMS, PLATFORMS_NAMES };

export default PLATFORMS;
