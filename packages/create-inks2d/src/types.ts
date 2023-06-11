type ColorFunc = (str: string | number) => string;

type PlatformVariant = {
	name: string;
	display: string;
	color: ColorFunc;
	customCommand?: string;
};

type Platform = {
	name: string;
	display: string;
	color: ColorFunc;
	variants?: PlatformVariant[];
};

export type { ColorFunc, Platform, PlatformVariant };
