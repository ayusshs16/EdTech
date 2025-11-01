/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		// allow Clerk-hosted avatars and common external avatar providers
		domains: [
			"img.clerk.com",
			"images.clerk.com",
			"avatars.githubusercontent.com",
			"lh3.googleusercontent.com",
		],
	},
};

export default nextConfig;
