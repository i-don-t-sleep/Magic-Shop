'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserRow } from '@/components/user-row';
import Pop from './pop';

export interface User {
  id: number;
  birthday: string;
  name: string;
  surname: string;
  username: string;
  defaultEmailAddress?: string;
  defaultPhoneNumber?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  accountStatus: 'Active' | 'Suspended' | 'Deactivated';
  sessionState: 'Offline' | 'Online';
  profilePicture: string | null;
  mimeType?: string;
  role: 'Customer' | 'Data Entry Admin' | 'Super Admin';
  lastLogin: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle row checkbox select
  const handleSelect = (id: number, checked: boolean) => {
    setSelectedRows(prev =>
      checked ? [...new Set([...prev, id])] : prev.filter(rowId => rowId !== id)
    );
  };

  // Action handlers
  const handleActionEdit = () => {
    const id = selectedRows[0];
    alert(`Edit user id: ${id}`);
    setShowActionsMenu(false);
  };

  const handleActionDelete = async () => {
    const id = selectedRows[0];
    if (!confirm(`ต้องการลบผู้ใช้งาน id=${id} ใช่หรือไม่?`)) {
      setShowActionsMenu(false);
      return;
    }
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete failed ${res.status}`);
      await fetchUsers();
      setSelectedRows([]);
    } catch (err) {
      console.error(err);
      alert('ลบไม่สำเร็จ ลองใหม่อีกครั้ง');
    } finally {
      setShowActionsMenu(false);
    }
  };

  // Filtered and paginated data
  const filteredUsers = users.filter(u =>
    [u.name, u.surname, u.username].some(field =>
      field.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
  );
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  // Export CSV
  const handleExport = () => {
    const header = ['Full Name', 'Email', 'Phone', 'Address', 'Session', 'Role', 'Last Login'];
    const rows = filteredUsers.map(u => [
      `${u.name} ${u.surname}`,
      u.defaultEmailAddress || '',
      u.defaultPhoneNumber || '',
      `${u.city || ''}, ${u.country || ''}, ${u.postalCode || ''}`,
      u.sessionState,
      u.role,
      new Date(u.lastLogin).toLocaleString()
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [header, ...rows].map(e => e.join(',')).join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', 'users_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Main Controls */}
      <div className="mt-10 px-6 pb-3 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          {/* Search */}
          <div className="w-full max-w-md">
            <Input
              placeholder="Search users..."
              className="bg-zinc-900 border-zinc-800 text-white"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Filters */}
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
          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="border-zinc-700 text-white" onClick={handleExport}>
              Export
            </Button>
            <Button className="bg-red-600 hover:bg-red-700" onClick={() => setShowModal(true)}>
              + New User
            </Button>
            <div className="relative">
              <Button
                variant="outline"
                disabled={selectedRows.length !== 1}
                className={`${selectedRows.length !== 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => selectedRows.length === 1 && setShowActionsMenu(v => !v)}
              >
                Actions <ChevronDown className="ml-2 h-4 w-4 inline-block" />
              </Button>
              {showActionsMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-zinc-800 border border-zinc-700 rounded shadow-lg z-50">
                  <button onClick={handleActionEdit} className="block w-full text-left px-4 py-2 hover:bg-zinc-700">
                    Edit
                  </button>
                  <button onClick={handleActionDelete} className="block w-full text-left px-4 py-2 hover:bg-zinc-700">
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table and Pagination */}
        <div className="bg-zinc-900 rounded-lg overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full table-auto min-w-full">
              <thead className="sticky top-0 bg-zinc-900 z-10">
                <tr className="border-b border-zinc-800">
                  <th className="px-4 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={
                        currentUsers.length > 0 &&
                        currentUsers.every(u => selectedRows.includes(u.id))
                      }
                      onChange={e => {
                        const checked = e.target.checked;
                        if (checked) {
                          setSelectedRows([
                            ...new Set([
                              ...selectedRows,
                              ...currentUsers.map(u => u.id)
                            ])
                          ]);
                        } else {
                          setSelectedRows(
                            selectedRows.filter(id =>
                              !currentUsers.some(u => u.id === id)
                            )
                          );
                        }
                      }}
                    />
                  </th>
                  <th className="px-4 py-2 text-left font-medium">
                    Full Name <ChevronDown className="inline-block ml-1 h-4 w-4" />
                  </th>
                  <th className="px-4 py-2 text-left font-medium">
                    Email <ChevronDown className="inline-block ml-1 h-4 w-4" />
                  </th>
                  <th className="px-4 py-2 text-left font-medium">Phone</th>
                  <th className="px-4 py-2 text-left font-medium">Address</th>
                  <th className="px-4 py-2 text-left font-medium">
                    Session <ChevronDown className="inline-block ml-1 h-4 w-4" />
                  </th>
                  <th className="px-4 py-2 text-left font-medium">
                    Role <ChevronDown className="inline-block ml-1 h-4 w-4" />
                  </th>
                  <th className="px-4 py-2 text-left font-medium">
                    Last Login <ChevronDown className="inline-block ml-1 h-4 w-4" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => (
                  <UserRow
                    key={user.id}
                    user={user}
                    selected={selectedRows.includes(user.id)}
                    onSelect={checked => handleSelect(user.id, checked)}
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
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <Button
                  key={number}
                  variant={currentPage === number ? 'default' : 'outline'}
                  className={`h-8 w-8 p-0 ${
                    currentPage === number
                      ? 'bg-red-600 hover:bg-red-700 border-red-600'
                      : 'border-zinc-700'
                  }`}
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-zinc-700"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-white">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>

        {showModal && (
          <Pop
            onClose={() => setShowModal(false)}
            onCreated={() => {
              setShowModal(false);
              fetchUsers();
            }}
          />
        )}
      </div>
    </>
  );
}
