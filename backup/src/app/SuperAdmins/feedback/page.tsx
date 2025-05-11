"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, Send } from "lucide-react"

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState("suggestion")
  const [feedbackText, setFeedbackText] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Here you would implement the actual API call to submit feedback
      // await fetch('/api/feedback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ type: feedbackType, message: feedbackText })
      // })

      setSubmitted(true)
      setLoading(false)
    } catch (error) {
      console.error("Failed to submit feedback:", error)
      setLoading(false)
      alert("Failed to submit feedback. Please try again.")
    }
  }

  const handleReset = () => {
    setFeedbackType("suggestion")
    setFeedbackText("")
    setSubmitted(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-3xl p-8 shadow-lg">
        <div className="flex items-center mb-6">
          <MessageSquare className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Send Feedback</h1>
        </div>

        {submitted ? (
          <div className="text-center py-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Thank You for Your Feedback!</h2>
            <p className="text-zinc-400 mb-6">
              We appreciate you taking the time to share your thoughts with us. Your feedback helps us improve the Magic
              Shop experience.
            </p>
            <Button onClick={handleReset}>Send Another Feedback</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Feedback Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["suggestion", "bug", "praise"].map((type) => (
                  <div
                    key={type}
                    className={`
                      border rounded-lg p-4 cursor-pointer transition-colors
                      ${
                        feedbackType === type
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-zinc-700 hover:border-zinc-600"
                      }
                    `}
                    onClick={() => setFeedbackType(type)}
                  >
                    <div className="font-medium capitalize">{type}</div>
                    <div className="text-sm text-zinc-400">
                      {type === "suggestion" && "Share your ideas"}
                      {type === "bug" && "Report an issue"}
                      {type === "praise" && "Tell us what you like"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="feedback-message" className="block text-sm font-medium">
                Your Feedback
              </label>
              <textarea
                id="feedback-message"
                rows={6}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tell us what's on your mind..."
                className="w-full rounded-md bg-zinc-800 border-zinc-700 p-3 text-white resize-none"
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading || !feedbackText.trim()} className="flex items-center">
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Feedback
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
