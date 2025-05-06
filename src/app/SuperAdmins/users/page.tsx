"use client"

import { useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Grid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserRow } from "@/components/user-row"

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
    // Adding more mock users to demonstrate scrolling
    {
      id: 10,
      name: "Emma Johnson",
      email: "emma@gmail.com",
      location: "Toronto,CA",
      joined: "April 5, 2019",
      frequency: 85,
    },
    {
      id: 11,
      name: "James Wilson",
      email: "james@gmail.com",
      location: "Melbourne,AU",
      joined: "May 12, 2019",
      frequency: 60,
    },
    {
      id: 12,
      name: "Sophia Garcia",
      email: "sophia@gmail.com",
      location: "Madrid,ES",
      joined: "June 23, 2019",
      frequency: 45,
    },
    {
      id: 13,
      name: "Liam Brown",
      email: "liam@gmail.com",
      location: "Berlin,DE",
      joined: "July 30, 2019",
      frequency: 90,
    },
    {
      id: 14,
      name: "Olivia Martinez",
      email: "olivia@gmail.com",
      location: "Paris,FR",
      joined: "August 15, 2019",
      frequency: 70,
    },
    {
      id: 15,
      name: "Noah Taylor",
      email: "noah@gmail.com",
      location: "Rome,IT",
      joined: "September 8, 2019",
      frequency: 55,
    },{
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
    // Adding more mock users to demonstrate scrolling
    {
      id: 10,
      name: "Emma Johnson",
      email: "emma@gmail.com",
      location: "Toronto,CA",
      joined: "April 5, 2019",
      frequency: 85,
    },
    {
      id: 11,
      name: "James Wilson",
      email: "james@gmail.com",
      location: "Melbourne,AU",
      joined: "May 12, 2019",
      frequency: 60,
    },
    {
      id: 12,
      name: "Sophia Garcia",
      email: "sophia@gmail.com",
      location: "Madrid,ES",
      joined: "June 23, 2019",
      frequency: 45,
    },
    {
      id: 13,
      name: "Liam Brown",
      email: "liam@gmail.com",
      location: "Berlin,DE",
      joined: "July 30, 2019",
      frequency: 90,
    },
    {
      id: 14,
      name: "Olivia Martinez",
      email: "olivia@gmail.com",
      location: "Paris,FR",
      joined: "August 15, 2019",
      frequency: 70,
    },
    {
      id: 15,
      name: "Noah Taylor",
      email: "noah@gmail.com",
      location: "Rome,IT",
      joined: "September 8, 2019",
      frequency: 55,
    },{
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
    // Adding more mock users to demonstrate scrolling
    {
      id: 10,
      name: "Emma Johnson",
      email: "emma@gmail.com",
      location: "Toronto,CA",
      joined: "April 5, 2019",
      frequency: 85,
    },
    {
      id: 11,
      name: "James Wilson",
      email: "james@gmail.com",
      location: "Melbourne,AU",
      joined: "May 12, 2019",
      frequency: 60,
    },
    {
      id: 12,
      name: "Sophia Garcia",
      email: "sophia@gmail.com",
      location: "Madrid,ES",
      joined: "June 23, 2019",
      frequency: 45,
    },
    {
      id: 13,
      name: "Liam Brown",
      email: "liam@gmail.com",
      location: "Berlin,DE",
      joined: "July 30, 2019",
      frequency: 90,
    },
    {
      id: 14,
      name: "Olivia Martinez",
      email: "olivia@gmail.com",
      location: "Paris,FR",
      joined: "August 15, 2019",
      frequency: 70,
    },
    {
      id: 15,
      name: "Noah Taylor",
      email: "noah@gmail.com",
      location: "Rome,IT",
      joined: "September 8, 2019",
      frequency: 55,
    },{
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
    // Adding more mock users to demonstrate scrolling
    {
      id: 10,
      name: "Emma Johnson",
      email: "emma@gmail.com",
      location: "Toronto,CA",
      joined: "April 5, 2019",
      frequency: 85,
    },
    {
      id: 11,
      name: "James Wilson",
      email: "james@gmail.com",
      location: "Melbourne,AU",
      joined: "May 12, 2019",
      frequency: 60,
    },
    {
      id: 12,
      name: "Sophia Garcia",
      email: "sophia@gmail.com",
      location: "Madrid,ES",
      joined: "June 23, 2019",
      frequency: 45,
    },
    {
      id: 13,
      name: "Liam Brown",
      email: "liam@gmail.com",
      location: "Berlin,DE",
      joined: "July 30, 2019",
      frequency: 90,
    },
    {
      id: 14,
      name: "Olivia Martinez",
      email: "olivia@gmail.com",
      location: "Paris,FR",
      joined: "August 15, 2019",
      frequency: 70,
    },
    {
      id: 15,
      name: "Noah Taylor",
      email: "noah@gmail.com",
      location: "Rome,IT",
      joined: "September 8, 2019",
      frequency: 55,
    },{
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
    // Adding more mock users to demonstrate scrolling
    {
      id: 10,
      name: "Emma Johnson",
      email: "emma@gmail.com",
      location: "Toronto,CA",
      joined: "April 5, 2019",
      frequency: 85,
    },
    {
      id: 11,
      name: "James Wilson",
      email: "james@gmail.com",
      location: "Melbourne,AU",
      joined: "May 12, 2019",
      frequency: 60,
    },
    {
      id: 12,
      name: "Sophia Garcia",
      email: "sophia@gmail.com",
      location: "Madrid,ES",
      joined: "June 23, 2019",
      frequency: 45,
    },
    {
      id: 13,
      name: "Liam Brown",
      email: "liam@gmail.com",
      location: "Berlin,DE",
      joined: "July 30, 2019",
      frequency: 90,
    },
    {
      id: 14,
      name: "Olivia Martinez",
      email: "olivia@gmail.com",
      location: "Paris,FR",
      joined: "August 15, 2019",
      frequency: 70,
    },
    {
      id: 15,
      name: "Noah Taylor",
      email: "noah@gmail.com",
      location: "Rome,IT",
      joined: "September 8, 2019",
      frequency: 55,
    },{
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
    // Adding more mock users to demonstrate scrolling
    {
      id: 10,
      name: "Emma Johnson",
      email: "emma@gmail.com",
      location: "Toronto,CA",
      joined: "April 5, 2019",
      frequency: 85,
    },
    {
      id: 11,
      name: "James Wilson",
      email: "james@gmail.com",
      location: "Melbourne,AU",
      joined: "May 12, 2019",
      frequency: 60,
    },
    {
      id: 12,
      name: "Sophia Garcia",
      email: "sophia@gmail.com",
      location: "Madrid,ES",
      joined: "June 23, 2019",
      frequency: 45,
    },
    {
      id: 13,
      name: "Liam Brown",
      email: "liam@gmail.com",
      location: "Berlin,DE",
      joined: "July 30, 2019",
      frequency: 90,
    },
    {
      id: 14,
      name: "Olivia Martinez",
      email: "olivia@gmail.com",
      location: "Paris,FR",
      joined: "August 15, 2019",
      frequency: 70,
    },
    {
      id: 15,
      name: "Noah Taylor",
      email: "noah@gmail.com",
      location: "Rome,IT",
      joined: "September 8, 2019",
      frequency: 55,
    },{
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
    // Adding more mock users to demonstrate scrolling
    {
      id: 10,
      name: "Emma Johnson",
      email: "emma@gmail.com",
      location: "Toronto,CA",
      joined: "April 5, 2019",
      frequency: 85,
    },
    {
      id: 11,
      name: "James Wilson",
      email: "james@gmail.com",
      location: "Melbourne,AU",
      joined: "May 12, 2019",
      frequency: 60,
    },
    {
      id: 12,
      name: "Sophia Garcia",
      email: "sophia@gmail.com",
      location: "Madrid,ES",
      joined: "June 23, 2019",
      frequency: 45,
    },
    {
      id: 13,
      name: "Liam Brown",
      email: "liam@gmail.com",
      location: "Berlin,DE",
      joined: "July 30, 2019",
      frequency: 90,
    },
    {
      id: 14,
      name: "Olivia Martinez",
      email: "olivia@gmail.com",
      location: "Paris,FR",
      joined: "August 15, 2019",
      frequency: 70,
    },
    {
      id: 15,
      name: "Noah Taylor",
      email: "noah@gmail.com",
      location: "Rome,IT",
      joined: "September 8, 2019",
      frequency: 55,
    },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredUsers.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredUsers.map((user) => user.id))
    }
  }

  const toggleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  // Calculate pagination
  const indexOfLastUser = currentPage * rowsPerPage
  const indexOfFirstUser = indexOfLastUser - rowsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage)

  return (
    <div className="pt-3 flex flex-col h-full overflow-hidden">
      <div className="px-6 pb-3 flex flex-col h-full">
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

        <div className="bg-zinc-900 rounded-lg overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-zinc-900 z-10">
                <tr className="border-b border-zinc-800">
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-600"
                      checked={selectedRows.length === filteredUsers.length && filteredUsers.length > 0}
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
            </table>
          </div>

          <div className="overflow-y-auto flex-1">
            <table className="w-full">
              <tbody>
                {currentUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    id={user.id}
                    name={user.name}
                    email={user.email}
                    location={user.location}
                    joined={user.joined}
                    frequency={user.frequency}
                    isSelected={selectedRows.includes(user.id)}
                    onToggleSelect={toggleSelectRow}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 flex items-center justify-between border-t border-zinc-800 bg-zinc-900 sticky bottom-0">
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

              {totalPages <= 7 ? (
                // If we have 7 or fewer pages, show all page numbers
                Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
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
                  {currentPage > 3 && <span className="px-2 text-zinc-500">...</span>}

                  {/* Pages around current page */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (number) =>
                        number !== 1 &&
                        number !== totalPages &&
                        ((currentPage <= 3 && number <= 5) ||
                          (currentPage > totalPages - 3 && number > totalPages - 5) ||
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
                  {currentPage < totalPages - 2 && <span className="px-2 text-zinc-500">...</span>}

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
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Show:</span>
              <Button variant="outline" className="border-zinc-700 text-white h-8">
                {rowsPerPage} rows
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
