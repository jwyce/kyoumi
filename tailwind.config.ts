import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
	darkMode: ['class'],
	content: ['./src/**/*.tsx'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-geist-sans)', ...fontFamily.sans],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					hovered: 'hsl(var(--card-hovered))',
					foreground: 'hsl(var(--card-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				link: 'hsl(var(--link))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))',
				},
				'topic-fun': 'hsl(var(--topic-fun) / <alpha-value>)',
				'topic-improvement': 'hsl(var(--topic-improvement) / <alpha-value>)',
				'topic-brown-bag': 'hsl(var(--topic-brown-bag) / <alpha-value>)',
				'topic-pain-point': 'hsl(var(--topic-pain-point) / <alpha-value>)',
				'topic-new-idea': 'hsl(var(--topic-new-idea) / <alpha-value>)',
			},
			boxShadow: {
				fun: '0 0 1rem -0.15rem hsl(var(--topic-fun))',
				improvement: '0 0 1rem -0.15rem hsl(var(--topic-improvement))',
				'brown-bag': '0 0 1rem -0.15rem hsl(var(--topic-brown-bag)',
				'pain-point': '0 0 1rem -0.15rem hsl(var(--topic-pain-point))',
				'new-idea': '0 0 1rem -0.15rem hsl(var(--topic-new-idea))',
			},
		},
	},
	plugins: [require('tailwindcss-animate'), require('tailwindcss-motion')],
} satisfies Config;
