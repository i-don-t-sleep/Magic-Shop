"use client"

import { useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Grid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface User {
  id: number
  name: string
  email: string
  location: string
  joined: string
  frequency: number
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(10)

  const users: User[] = [
    {
      id: 1,
      name: "Leslie Maya",
      email: "leslie@gmail.com",
      location: "Los Angeles,CA",
      joined: "October 2, 2010",
      frequency: 75,
    },
    {
      id: 2,
      name: "Josie Deck",
      email: "josie@gmail.com",
      location: "Cheyenne,WY",
      joined: "October 3, 2011",
      frequency: 20,
    },
    {
      id: 3,
      name: "Alex Pfeiffer",
      email: "alex@gmail.com",
      location: "Cheyenne,WY",
      joined: "May 20, 2015",
      frequency: 50,
    },
    {
      id: 4,
      name: "Mike Dean",
      email: "mike@gmail.com",
      location: "Syracuse,NY",
      joined: "July 14, 2015",
      frequency: 75,
    },
    {
      id: 5,
      name: "Mateus Cunha",
      email: "cunha@gmail.com",
      location: "Luanda,AN",
      joined: "October, 2016",
      frequency: 100,
    },
    {
      id: 6,
      name: "Nzola Uemo",
      email: "nzola@gmail.com",
      location: "Lagos,NG",
      joined: "June 5, 2016",
      frequency: 100,
    },
    {
      id: 7,
      name: "Antony Mack",
      email: "mack@gmail.com",
      location: "London,ENG",
      joined: "June 15, 2015",
      frequency: 75,
    },
    {
      id: 8,
      name: "André da Silva",
      email: "andré@gmail.com",
      location: "São Paulo,BR",
      joined: "March 13, 2018",
      frequency: 50,
    },
    {
      id: 9,
      name: "Jorge Ferreira",
      email: "jorge@gmail.com",
      location: "Huambo,Angola",
      joined: "March 14, 2018",
      frequency: 20,
    },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleSelectAll = () => {
    if (selectedRows.length === users.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(users.map((user) => user.id))
    }
  }

  const toggleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      <div className="px-6 pb-3">
        <h1 className="text-3xl font-bold mb-6"></h1>

        <div className="flex justify-between items-center mb-6">
          <div className="w-full max-w-md">
            <Input
              placeholder="Search items..."
              className="bg-zinc-900 border-zinc-800 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="border-zinc-700 text-white">
              Permissions <span className="text-red-600 ml-1">All</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>

            <Button variant="outline" className="border-zinc-700 text-white">
              Joined <span className="text-red-600 ml-1">Anytime</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>

            <Button variant="outline" className="border-zinc-700 text-white p-2">
              <Grid className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="border-zinc-700 text-white">
              Export
            </Button>
            <Button className="bg-red-600 hover:bg-red-700">
              <span className="mr-1">+</span> New User
            </Button>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-600"
                    checked={selectedRows.length === users.length && users.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4 text-left font-medium">Full Name</th>
                <th className="p-4 text-left font-medium">
                  Email Address
                  <ChevronDown className="inline-block ml-1 h-4 w-4" />
                </th>
                <th className="p-4 text-left font-medium">
                  Location
                  <ChevronDown className="inline-block ml-1 h-4 w-4" />
                </th>
                <th className="p-4 text-left font-medium">
                  Joined
                  <ChevronDown className="inline-block ml-1 h-4 w-4" />
                </th>
                <th className="p-4 text-left font-medium">
                  Frequency
                  <ChevronDown className="inline-block ml-1 h-4 w-4" />
                </th>
                <th className="p-4 text-center">
                  <Button variant="ghost" size="icon" className="text-zinc-400">
                    <Grid className="h-5 w-5" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-600"
                      checked={selectedRows.includes(user.id)}
                      onChange={() => toggleSelectRow(user.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className="inline-block w-1.5 h-1.5 bg-zinc-400 rounded-full mr-2"></span>
                      {user.location}
                    </div>
                  </td>
                  <td className="p-4">{user.joined}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-red-600 h-full rounded-full" style={{ width: `${user.frequency}%` }}></div>
                      </div>
                      <span className="text-sm">{user.frequency}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <Button variant="ghost" size="icon" className="text-zinc-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 flex items-center justify-between border-t border-zinc-800">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-zinc-700"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button variant="default" className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700 border-red-600">
                1
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0 border-zinc-700">
                2
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0 border-zinc-700">
                3
              </Button>
              <Button variant="outline" className="h-8 w-8 p-0 border-zinc-700">
                4
              </Button>
              <span className="px-2 text-zinc-500">...</span>
              <Button variant="outline" className="h-8 w-8 p-0 border-zinc-700">
                10
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-zinc-700"
                onClick={() => setCurrentPage(Math.min(10, currentPage + 1))}
                disabled={currentPage === 10}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Show:</span>
              <Button variant="outline" className="border-zinc-700 text-white h-8">
                10 rows
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
