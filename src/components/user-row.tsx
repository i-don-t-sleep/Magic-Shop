'use client';

import React from 'react';

/* --------- types --------- */
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

export interface UserRowProps {
  user: User;
  selected: boolean;
  onSelect: (checked: boolean) => void;
}

/* --------- component --------- */
export function UserRow({ user, selected, onSelect }: UserRowProps) {
  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/50">
      {/* 1) Checkbox */}
      <td className="p-4">
        <input
          type="checkbox"
          className="rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-red-600"
          checked={selected}
          onChange={e => onSelect(e.target.checked)}
        />
      </td>

      {/* 2) Full Name (avatar-like initial + name) */}
      <td className="px-4 py-2 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center uppercase text-sm">
            {user.username.charAt(0)}
          </div>
          <span>{user.name} {user.surname}</span>
        </div>
      </td>

      {/* 3) Email */}
      <td className="px-4 py-2">{user.defaultEmailAddress || '-'}</td>

      {/* 4) Phone */}
      <td className="px-4 py-2">{user.defaultPhoneNumber || '-'}</td>

      {/* 5) Address – truncate with “…” */}
      <td className="px-4 py-2 max-w-[15rem]">
        <span
          className="block truncate"
          title={`${user.city || '-'}, ${user.country || '-'}, ${user.postalCode || '-'}`}
        >
          {user.city || '-'}, {user.country || '-'}, {user.postalCode || '-'}
        </span>
      </td>

      {/* 6) Session */}
      <td className="px-4 py-2">{user.sessionState}</td>

      {/* 7) Role */}
      <td className="px-4 py-2">{user.role}</td>

      {/* 8) Last Login */}
      <td className="px-4 py-2 whitespace-nowrap">
        {new Date(user.lastLogin).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })}
      </td>
    </tr>
  );
}
