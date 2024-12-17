/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig & import('prettier-plugin-tailwindcss').PluginOptions}  } */
const config = {
	useTabs: true,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'es5',
	printWidth: 80,
	importOrder: [
		'^(react/(.*)$)|^(react$)',
		'^(next/(.*)$)|^(next$)',
		'<THIRD_PARTY_MODULES>',
		'<TYPES>',
		'<TYPES>^[.]',
		'^types$',
		'^@/types/(.*)$',
		'^@/config/(.*)$',
		'^@/utils/(.*)$',
		'^@/lib/(.*)$',
		'^@/hooks/(.*)$',
		'^@/components/ui/(.*)$',
		'^@/components/(.*)$',
		'^@/styles/(.*)$',
		'^@/app/(.*)$',
		'^[./]',
	],

	importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
	plugins: [
		'@ianvs/prettier-plugin-sort-imports',
		'prettier-plugin-tailwindcss',
	],
};

export default config;
