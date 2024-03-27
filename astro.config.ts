import db from "@astrojs/db"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import vercel from "@astrojs/vercel/serverless"
import AstroPWA from "@vite-pwa/astro"
import { defineConfig } from "astro/config"
import auth from "auth-astro"

// Helper imports
import { manifest, seoConfig } from "./src/utils/seoConfig"

// https://astro.build/config
export default defineConfig({
	prefetch: true,
	devToolbar: {
		enabled: false,
	},
	integrations: [
		tailwind(),
		sitemap(),
		auth(),
		db(),
		AstroPWA({
			registerType: "autoUpdate",
			manifest,
			workbox: {
				globDirectory: ".vercel/output/static",
				globPatterns: ["**/*.{svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}"],
				runtimeCaching: [
					{
						urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
						handler: "CacheFirst",
						options: {
							cacheName: "images",
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 30 * 24 * 60 * 60,
							},
						},
					},
					{
						urlPattern: /\.(?:woff|woff2|ttf|eot|ico)$/,
						handler: "CacheFirst",
						options: {
							cacheName: "fonts",
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 30 * 24 * 60 * 60,
							},
						},
					},
				],
				navigateFallback: null,
			},
			experimental: {
				directoryAndTrailingSlashHandler: true,
			},
			devOptions: {
				enabled: true,
			},
		}),
	],
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
	}),
	build: {
		inlineStylesheets: "always",
	},
	output: "server",
	site: seoConfig.baseURL,
	vite: {
		build: {
			cssMinify: "lightningcss",
		},
		ssr: {
			noExternal: ["path-to-regexp"],
		},
	},
})
