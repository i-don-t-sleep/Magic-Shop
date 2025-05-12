'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

export interface Admin {
  id: number;
  username: string;
  name: string;
  surname: string;
  birthday: string;
  defaultEmail?: string;
  defaultPhone?: string;
  accountStatus: 'Active' | 'Suspended' | 'Deactivated';
  sessionState: 'Offline' | 'Online';
  profilePicture?: string | null;
  mimeType?: string;
  role: 'Super Admin' | 'Data Entry Admin';
  lastLogin: string;
}

export interface AdminRowProps {
  admin: Admin;
  selected: boolean;
  onSelect: (checked: boolean) => void;
}

export function AdminRow({ admin, selected, onSelect }: AdminRowProps) {
  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/50">
      <td className="p-4 text-center">
        <input
          type="checkbox"
          className="rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-600"
          checked={selected}
          onChange={e => onSelect(e.target.checked)}
        />
      </td>
      <td className="p-4">{admin.username}</td>
      <td className="p-4 flex items-center gap-2">
        {admin.profilePicture ? (
          <img
            src={admin.profilePicture}
            alt={admin.name}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-zinc-700 flex items-center justify-center text-white">
            {admin.name.charAt(0)}
          </div>
        )}
        <span>{admin.name} {admin.surname}</span>
      </td>
      <td className="p-4">{new Date(admin.birthday).toLocaleDateString()}</td>
      <td className="p-4">{admin.defaultEmail || '-'}</td>
      <td className="p-4">{admin.defaultPhone || '-'}</td>
      <td className="p-4">{admin.accountStatus}</td>
      <td className="p-4">{admin.sessionState}</td>
      <td className="p-4">{admin.role}</td>
      <td className="p-4">{new Date(admin.lastLogin).toLocaleString()}</td>
      <td className="p-4 text-center">
        <Button variant="ghost" size="icon" className="text-zinc-400">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </td>
    </tr>
  );
}
