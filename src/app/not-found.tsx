import Link from "next/link"

export default function notFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-zinc-400 mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
        Return Home
      </Link>
    </div>
  )
}
