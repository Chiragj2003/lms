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
            { protocol : "https", hostname : "lh3.googleusercontent.com" },
            { protocol : "https", hostname : "files.edgestore.dev" },
            // Demo course artwork and placeholder reviewer avatars.
            { protocol : "https", hostname : "picsum.photos" },
            { protocol : "https", hostname : "i.pravatar.cc" }
        ]
    }
};

export default nextConfig