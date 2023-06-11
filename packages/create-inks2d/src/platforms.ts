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

export default PLATFORMS;
