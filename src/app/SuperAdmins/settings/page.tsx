"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, Save, User } from "lucide-react"

export default function SettingsPage() {
  const [username, setUsername] = useState("User")
  const [email, setEmail] = useState("user@example.com")
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=200&width=200")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  // Load user data on component mount
  useState(() => {
    const getCookie = (name: string) => {
      const match = document?.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
      return match ? decodeURIComponent(match[2]) : null
    }

    const cookieData = getCookie("account-info")
    if (!cookieData) return

    try {
      const parsed = JSON.parse(cookieData)
      setUsername(parsed.username || "User")
      setEmail(parsed.email || "user@example.com")
      setProfileImage(`/api/blob/users/${encodeURIComponent(parsed.username)}`)
    } catch (err) {
      console.error("Invalid cookie format:", err)
    }
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      setProfileImage(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Here you would implement the actual API call to update user settings
      // const formData = new FormData()
      // formData.append('username', username)
      // formData.append('email', email)
      // if (selectedFile) formData.append('profileImage', selectedFile)
      // await fetch('/api/user/settings', { method: 'POST', body: formData })

      setLoading(false)
      alert("Settings updated successfully!")
    } catch (error) {
      console.error("Failed to update settings:", error)
      setLoading(false)
      alert("Failed to update settings. Please try again.")
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-3xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-40 h-40 rounded-full overflow-hidden bg-zinc-800 border-2 border-zinc-700">
              <Image src={profileImage || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
              <label
                htmlFor="profile-upload"
                className="absolute bottom-2 right-2 bg-zinc-900 p-2 rounded-full cursor-pointer hover:bg-zinc-800 transition-colors"
              >
                <Camera className="h-5 w-5" />
                <span className="sr-only">Upload new image</span>
              </label>
              <input id="profile-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
            <p className="text-sm text-zinc-400">Click the camera icon to change your profile picture</p>
          </div>

          {/* User Details Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-zinc-800 border-zinc-700"
                    placeholder="Username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-800 border-zinc-700"
                  placeholder="Email address"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="theme" className="block text-sm font-medium">
                  Theme Preference
                </label>
                <select id="theme" className="w-full rounded-md bg-zinc-800 border-zinc-700 p-2 text-white">
                  <option value="dark">Dark (Default)</option>
                  <option value="light">Light</option>
                  <option value="system">System Preference</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="notifications" className="block text-sm font-medium">
                  Notification Settings
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="email-notifications"
                      type="checkbox"
                      className="rounded bg-zinc-800 border-zinc-700 mr-2"
                      defaultChecked
                    />
                    <label htmlFor="email-notifications">Email notifications</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="browser-notifications"
                      type="checkbox"
                      className="rounded bg-zinc-800 border-zinc-700 mr-2"
                      defaultChecked
                    />
                    <label htmlFor="browser-notifications">Browser notifications</label>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                {loading ? (
                  <span className="flex items-center">
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
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
