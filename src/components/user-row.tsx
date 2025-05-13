'use client';

import React from 'react';
import { User } from '@/app/SuperAdmins/users/page'; // ปรับ path ตามโครงสร้างโปรเจกต์จริง

export interface UserRowProps {
  user: User;
  selected: boolean;
  onSelect: (checked: boolean) => void;
}

export function UserRow({ user, selected, onSelect }: UserRowProps) {
  const {
    id,
    name,
    surname,
    defaultEmailAddress,
    defaultPhoneNumber,
    city,
    country,
    postalCode,
    sessionState,
    role,
    lastLogin,
  } = user;

  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/50">
      <td className="px-4 py-2">
        <input
          type="checkbox"
          className="rounded border-zinc-700 bg-zinc-900 text-red-600 focus:ring-red-600"
          checked={selected}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSelect(e.target.checked)
          }
        />
      </td>
      <td className="px-4 py-2">{name} {surname}</td>
      <td className="px-4 py-2">{defaultEmailAddress || '-'}</td>
      <td className="px-4 py-2">{defaultPhoneNumber || '-'}</td>
      <td className="px-4 py-2">
        {city || '-'}, {country || '-'} {postalCode || ''}
      </td>
      <td className="px-4 py-2">{sessionState}</td>
      <td className="px-4 py-2">{role}</td>
      <td className="px-4 py-2">
        {new Date(lastLogin).toLocaleString('th-TH', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </td>
    </tr>
  );
}
