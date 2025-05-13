// src/app/SuperAdmins/users/pop.tsx
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

interface PopProps {
  onClose(): void
  onCreated(): void
}

export default function Pop({ onClose, onCreated }: PopProps) {
  const [name, setName]       = useState('')
  const [surname, setSurname] = useState('')
  const [email, setEmail]     = useState('')
  const [phone, setPhone]     = useState('')
  const [city, setCity]       = useState('')
  const [country, setCountry] = useState('')
  const [postalCode, setPC]   = useState('')
  const [role, setRole]       = useState<'Customer'|'Data Entry Admin'|'Super Admin'>('Customer')

  // กำหนด session เป็น Online ตลอด ไม่ต้องกรอก
  const session = 'Online'

  const handleSubmit = async () => {
    await fetch('/api/users', {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({
        name,
        surname,
        email,
        phone,
        city,
        country,
        postalCode,
        sessionState: session,
        role,
      })
    })
    onCreated()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-zinc-900 p-6 rounded-2xl w-full max-w-md space-y-4 shadow-lg">
        <h2 className="text-2xl font-semibold text-white text-center">New User</h2>

        <Input
          placeholder="First Name"
          className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 text-white"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Input
          placeholder="Last Name"
          className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 text-white"
          value={surname}
          onChange={e => setSurname(e.target.value)}
        />
        <Input
          placeholder="Email"
          type="email"
          className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 text-white"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          placeholder="Phone"
          className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 text-white"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <div className="flex gap-2">
          <Input
            placeholder="City"
            className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 text-white"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <Input
            placeholder="Country"
            className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 text-white"
            value={country}
            onChange={e => setCountry(e.target.value)}
          />
          <Input
            placeholder="Postal Code"
            className="bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 text-white"
            value={postalCode}
            onChange={e => setPC(e.target.value)}
          />
        </div>

        {/* ยืดกล่อง Role ให้เต็ม width */}
        <Select onValueChange={v => setRole(v as any)}>
          <SelectTrigger className="w-full bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-red-600">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border border-zinc-700 text-white">
            <SelectItem className="hover:bg-zinc-700" value="Customer">Customer</SelectItem>
            <SelectItem className="hover:bg-zinc-700" value="Data Entry Admin">Data Entry Admin</SelectItem>
            <SelectItem className="hover:bg-zinc-700" value="Super Admin">Super Admin</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create</Button>
        </div>
      </div>
    </div>
  )
}
