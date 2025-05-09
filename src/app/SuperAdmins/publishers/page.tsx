"use client"

import { useState, useEffect } from "react"
import { Search, Plus, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { LoadingComp } from "@/components/loading-comp"

interface Publisher {
  id: number
  name: string
  description?: string
  servicesFee?: number
  publisherWeb?: string
}

export default function PublishersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [publishers, setPublishers] = useState<Publisher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPublishers()
  }, [])

  const fetchPublishers = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/publishers")

      if (!response.ok) {
        throw new Error(`Error fetching publishers: ${response.status}`)
      }

      const data = await response.json()
      if (data.success) {
        setPublishers(data.publishers)
      } else {
        throw new Error(data.message || "Failed to fetch publishers")
      }
    } catch (err) {
      console.error("Error fetching publishers:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleAddPublisher = () => {
    router.push("/SuperAdmins/publishers/add")
  }

  const filteredPublishers = publishers.filter((publisher) =>
    publisher.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (error) {
    return (
      <div className="pt-3 flex flex-col h-full overflow-hidden">
        <div className="px-6 pb-6 flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl text-red-500 mb-4">Error loading publishers</h2>
            <p className="text-zinc-400 mb-4">{error}</p>
            <Button onClick={fetchPublishers}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      {/* Header with search and add button */}
      <div className="px-6 pb-3 flex justify-between items-center">
        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Search publishers..."
              className="pl-10 bg-zinc-900 border-zinc-800 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Button className="bg-red-600 hover:bg-red-700" onClick={handleAddPublisher}>
          <Plus className="h-4 w-4 mr-2" />
          Add Publisher
        </Button>
      </div>

      {/* Publishers grid */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingComp />
          </div>
        ) : filteredPublishers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-xl mb-4">No publishers found</h2>
            <p className="text-zinc-400 mb-6">
              {searchQuery ? "Try adjusting your search" : "Add your first publisher to get started"}
            </p>
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleAddPublisher}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Publisher
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPublishers.map((publisher) => (
              <PublisherCard key={publisher.id} publisher={publisher} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function PublisherCard({ publisher }: { publisher: Publisher }) {
  return (
    <div className="p-[1px] bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19px]">
      <div className="p-[1px] bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-[18px] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center overflow-hidden">
              {/* Publisher logo would go here */}
              <span className="text-2xl font-bold">{publisher.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">{publisher.name}</h3>
              {publisher.servicesFee !== undefined && (
                <p className="text-sm text-zinc-400">Fee: {publisher.servicesFee}%</p>
              )}
            </div>
          </div>

          {publisher.description && <p className="text-sm text-zinc-300 mb-4 line-clamp-3">{publisher.description}</p>}

          {publisher.publisherWeb && (
            <a
              href={publisher.publisherWeb}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Website
            </a>
          )}

          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" className="border-zinc-700">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
