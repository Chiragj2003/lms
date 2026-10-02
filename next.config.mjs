/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack : {
        root : import.meta.dirname
    },
    images : {
        // Optimization back on. `unoptimized: true` was a shortcut around
        // "hostname not configured"; the real fix is listing the hosts, which
        // lets Next resize/compress thumbnails and avatars instead of serving
        // them full-size.
        remotePatterns : [
            { protocol : "https", hostname : "res.cloudinary.com" },
            // Profile pictures from the two sign-in providers. GitHub's was
            // missing, so a course by a GitHub-signed-in tutor failed to render.
            { protocol : "https", hostname : "lh3.googleusercontent.com" },
            { protocol : "https", hostname : "avatars.githubusercontent.com" },
            { protocol : "https", hostname : "files.edgestore.dev" },
            // Demo course artwork and placeholder reviewer avatars.
            { protocol : "https", hostname : "picsum.photos" },
            { protocol : "https", hostname : "i.pravatar.cc" },
            { protocol : "https", hostname : "images.unsplash.com" }
        ]
    }
};

export default nextConfig