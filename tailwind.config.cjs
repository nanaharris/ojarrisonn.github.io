/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [require("@tailwindcss/typography"), require("daisyui")],
	daisyui: {
		themes: [
			"light", "dark", "night",
			{
				"catppuccin": {
					"primary": "#cba6f7",
					"secondary": "#f5c2e7",
					"accent": "#cba6f7",
					"neutral": "#313244",
					"base-100": "#1e1e2e",
					"info": "#7ac7ec",
					"success": "#a6e3a1",
					"warning": "#fab387",
					"error": "#f38ba8",
				},
			},{
				"catppuccin-amoled": {
					"primary": "#cba6f7",
					"secondary": "#f5c2e7",
					"accent": "#cba6f7",
					"neutral": "#313244",
					"base-100": "#000",
					"info": "#7ac7ec",
					"success": "#a6e3a1",
					"warning": "#fab387",
					"error": "#f38ba8",
				},
			}
		], // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
		darkTheme: "dark", // name of one of the included themes for dark mode
		logs: false, // Shows info about daisyUI version and used config in the console when building your CSS
	}
}
