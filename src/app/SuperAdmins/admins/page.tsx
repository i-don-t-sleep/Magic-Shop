'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AdminRow, Admin } from '@/components/admins-row';

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admins-super')
      .then(res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json() as Promise<Admin[]>;
      })
      .then(data => setAdmins(data))
      .catch(err => console.error('Failed to load admins:', err))
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (id: number, checked: boolean) =>
    setSelectedRows(prev =>
      checked ? [...prev, id] : prev.filter(x => x !== id)
    );

  const filtered = admins.filter(a =>
    [a.username, a.name, a.surname]
      .some(f => f.toLowerCase().includes(search.trim().toLowerCase()))
  );

  if (loading) return <p className="p-8">Loading admins…</p>;

  return (
    <div className="p-8 space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search admins…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex space-x-2">
          <Button disabled size="icon"><ChevronLeft /></Button>
          <Button disabled size="icon"><ChevronRight /></Button>
        </div>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="border-b border-zinc-800">
            <th className="p-4 text-center"><input type="checkbox" disabled /></th>
            <th className="p-4 text-left">Username</th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Birthday</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Phone</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Session</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Last Login</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(admin => (
            <AdminRow
              key={admin.id}
              admin={admin}
              selected={selectedRows.includes(admin.id)}
              onSelect={checked => toggleSelect(admin.id, checked)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
