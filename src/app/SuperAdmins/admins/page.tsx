"use client"

import { useState } from "react"
import { ChevronDown, Grid, MapPin, MoreHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Admin {
  id: number
  name: string
  email: string
  location: string
  joined: string
  status: "Online" | "Offline"
}

const admins: Admin[] = [
  {
    id: 1,
    name: "Leslie Maya",
    email: "leslie@gmail.com",
    location: "Los Angeles,CA",
    joined: "October 2, 2010",
    status: "Online",
  },
  {
    id: 2,
    name: "Josie Deck",
    email: "josie@gmail.com",
    location: "Cheyenne,WY",
    joined: "October 3, 2011",
    status: "Online",
  },
  {
    id: 3,
    name: "Alex Pfeiffer",
    email: "alex@gmail.com",
    location: "Cheyenne,WY",
    joined: "May 20, 2015",
    status: "Online",
  },
  {
    id: 4,
    name: "Mike Dean",
    email: "mike@gmail.com",
    location: "Syracuse,NY",
    joined: "July 14, 2015",
    status: "Online",
  },
  {
    id: 5,
    name: "Mateus Cunha",
    email: "cunha@gmail.com",
    location: "Luanda,AN",
    joined: "October, 2016",
    status: "Online",
  },
  {
    id: 6,
    name: "Nzola Uemo",
    email: "nzola@gmail.com",
    location: "Lagos,NG",
    joined: "June 5, 2016",
    status: "Online",
  },
  {
    id: 7,
    name: "Antony Mack",
    email: "mack@gmail.com",
    location: "London,ENG",
    joined: "June 15, 2015",
    status: "Offline",
  },
  {
    id: 8,
    name: "André da Silva",
    email: "andré@gmail.com",
    location: "São Paulo,BR",
    joined: "March 13, 2018",
    status: "Offline",
  },
  {
    id: 9,
    name: "Jorge Ferreira",
    email: "jorge@gmail.com",
    location: "Huambo,Angola",
    joined: "March 14, 2018",
    status: "Offline",
  },
  {
    id: 10,
    name: "Emma Johnson",
    email: "emma@gmail.com",
    location: "Toronto,CA",
    joined: "April 5, 2019",
    status: "Online",
  },
]

export default function AdminsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(10)

  const totalPages = Math.ceil(admins.length / rowsPerPage)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  const toggleSelectAll = () => {
    if (selectedRows.length === admins.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(admins.map((admin) => admin.id))
    }
  }

  const toggleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const currentAdmins = admins.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  return (
    <div className="flex flex-col h-full">
      {/* Header with search and filters */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search items..."
            className="pl-10 bg-zinc-900 border-zinc-800 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Button variant="outline" className="border-zinc-700 text-white pr-10">
              Permissions
              <span className="text-red-600 ml-2">All</span>
              <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2" />
            </Button>
          </div>

          <div className="relative">
            <Button variant="outline" className="border-zinc-700 text-white pr-10">
              Joined
              <span className="text-red-600 ml-2">Anytime</span>
              <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2" />
            </Button>
          </div>

          <Button variant="outline" className="border-zinc-700 text-white px-3">
            <Grid className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="border-zinc-700 text-white">
            Export
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <span className="mr-1">+</span> New Admin
          </Button>
        </div>
      </div>

      {/* Admin table */}
      <div className="px-6 flex-1 overflow-auto">
        <div className="bg-zinc-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="p-4 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-600"
                        checked={selectedRows.length === admins.length && admins.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </div>
                  </th>
                  <th className="p-4 text-left font-medium">Full Name</th>
                  <th className="p-4 text-left font-medium">
                    <div className="flex items-center">
                      Email Address
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th className="p-4 text-left font-medium">
                    <div className="flex items-center">
                      Location
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th className="p-4 text-left font-medium">
                    <div className="flex items-center">
                      Joined
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-center">
                    <Button variant="ghost" size="icon" className="text-zinc-400">
                      <Grid className="h-5 w-5" />
                    </Button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentAdmins.map((admin) => (
                  <tr key={admin.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                    <td className="p-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-600"
                          checked={selectedRows.includes(admin.id)}
                          onChange={() => toggleSelectRow(admin.id)}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
                          {admin.name.charAt(0)}
                        </div>
                        <span>{admin.name}</span>
                      </div>
                    </td>
                    <td className="p-4">{admin.email}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-zinc-400" />
                        <span>{admin.location}</span>
                      </div>
                    </td>
                    <td className="p-4">{admin.joined}</td>
                    <td className="p-4">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          admin.status === "Online" ? "bg-green-400/10 text-green-400" : "bg-zinc-400/10 text-zinc-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            admin.status === "Online" ? "bg-green-400" : "bg-zinc-400"
                          }`}
                        ></span>
                        {admin.status}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Button variant="ghost" size="icon" className="text-zinc-400">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 flex items-center justify-between border-t border-zinc-800">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-zinc-700"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
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
                  className="h-4 w-4"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>

              {totalPages <= 7 ? (
                // If we have 7 or fewer pages, show all page numbers
                pageNumbers.map((number) => (
                  <Button
                    key={number}
                    variant={currentPage === number ? "default" : "outline"}
                    className={`h-8 w-8 p-0 ${
                      currentPage === number ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-zinc-700"
                    }`}
                    onClick={() => setCurrentPage(number)}
                  >
                    {number}
                  </Button>
                ))
              ) : (
                // If we have more than 7 pages, show a subset with ellipsis
                <>
                  {/* First page */}
                  <Button
                    variant={currentPage === 1 ? "default" : "outline"}
                    className={`h-8 w-8 p-0 ${
                      currentPage === 1 ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-zinc-700"
                    }`}
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </Button>

                  {/* Show ellipsis if current page is far from the start */}
                  {currentPage > 4 && <span className="px-2 text-zinc-500">...</span>}

                  {/* Pages around current page */}
                  {pageNumbers
                    .filter(
                      (number) =>
                        number !== 1 &&
                        number !== totalPages &&
                        ((currentPage <= 4 && number <= 5) ||
                          (currentPage > totalPages - 4 && number > totalPages - 5) ||
                          (number >= currentPage - 1 && number <= currentPage + 1)),
                    )
                    .map((number) => (
                      <Button
                        key={number}
                        variant={currentPage === number ? "default" : "outline"}
                        className={`h-8 w-8 p-0 ${
                          currentPage === number ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-zinc-700"
                        }`}
                        onClick={() => setCurrentPage(number)}
                      >
                        {number}
                      </Button>
                    ))}

                  {/* Show ellipsis if current page is far from the end */}
                  {currentPage < totalPages - 3 && <span className="px-2 text-zinc-500">...</span>}

                  {/* Last page */}
                  {totalPages > 1 && (
                    <Button
                      variant={currentPage === totalPages ? "default" : "outline"}
                      className={`h-8 w-8 p-0 ${
                        currentPage === totalPages ? "bg-red-600 hover:bg-red-700 border-red-600" : "border-zinc-700"
                      }`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  )}
                </>
              )}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-zinc-700"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
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
                  className="h-4 w-4"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Show:</span>
              <div className="relative">
                <Button variant="outline" className="border-zinc-700 text-white h-8 pr-8">
                  10 rows
                  <ChevronDown className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}