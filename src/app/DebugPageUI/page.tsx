"use client"

import type React from "react"
import { useState } from "react"
import { TagInput } from "@/components/ui/tag-input"
import { Button } from "@/components/ui/button"

export default function TagInputDemo() {
  const [tags, setTags] = useState<string[]>(["JavaScript", "cssscript"])
  const [formSubmitted, setFormSubmitted] = useState(false)

  const suggestions = [
    "JavaScript",
    "TypeScript",
    "React",
    "Vue",
    "Angular",
    "Svelte",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "CSS3",
    "HTML5",
    "Tailwind CSS",
    "Bootstrap",
    "Redux",
    "GraphQL",
    "REST API",
    "Docker",
    "Kubernetes",
    "AWS",
    "Firebase",
    "Git",
    "GitHub",
    "Vercel",
    "Netlify",
    "Heroku",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    setTimeout(() => setFormSubmitted(false), 3000)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Allows New Tags</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TagInput
          value={tags}
          onChange={setTags}
          suggestions={suggestions}
          placeholder="Add tags..."
          allowNewTags={true}
        />

        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          Submit form
        </Button>

        {formSubmitted && (
          <div className="p-3 bg-green-100 text-green-800 rounded-md">Form submitted with tags: {tags.join(", ")}</div>
        )}
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Current Tags:</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <div key={index} className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
