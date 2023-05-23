import PLATFORMS from "platforms";

const TEMPLATES = PLATFORMS.map(
	(f) => (f.variants && f.variants.map((v) => v.name)) || [f.name],
).reduce((a, b) => a.concat(b), []);

export default TEMPLATES;
