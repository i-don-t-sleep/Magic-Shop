"use client";

import React from "react";

export interface Publisher {
  id: number;
  username?: string | null;
  name: string;
  description?: string;
  defaultEmail?: string;
  defaultPhone?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  publisherWeb?: string;
  sessionState?: "Online" | "Offline";
  servicesFee?: number;
  logoUrl?: string | null;
}

export interface PublisherRowProps {
  publisher: Publisher;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onDelete: (id: number) => void;
}

export const PublisherRow: React.FC<PublisherRowProps> = ({
  publisher,
  selected,
  onSelect,
  onDelete,
}) => {
  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete publisher \"${publisher.name}\"?`)) {
      onDelete(publisher.id);
    }
  };

  return (
    <tr className="border-b border-zinc-800 hover:bg-zinc-800/50">
      {/* <td className="px-4 py-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={e => onSelect(e.target.checked)}
          className="rounded bg-zinc-700"
        />
      </td> */}
      <td className="px-4 py-2">
        {publisher.logoUrl ? (
          <img
            src={publisher.logoUrl}
            alt={publisher.name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 bg-zinc-700 rounded-full flex items-center justify-center text-white">
            {publisher.name.charAt(0)}
          </div>
        )}
      </td>
      <td className="px-4 py-2">{publisher.username}</td>
      <td className="px-4 py-2">{publisher.name}</td>
      <td className="px-4 py-2">{publisher.defaultEmail ?? "-"}</td>
      <td className="px-4 py-2">{publisher.defaultPhone ?? "-"}</td>
      <td className="px-4 py-2 max-w-[15rem]">
        <span className="block truncate">
          {[publisher.city, publisher.country, publisher.postalCode]
            .filter(Boolean)
            .join(", ") || "-"}
        </span>
      </td>
      <td className="px-4 py-2">{publisher.sessionState}</td>
      <td className="px-4 py-2">{publisher.servicesFee != null ? `${publisher.servicesFee}%` : "-"}</td>
      <td className="px-4 py-2">
        {publisher.publisherWeb ? (
          <a
            href={publisher.publisherWeb}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Website
          </a>
        ) : (
          "-"
        )}
      </td>
      <td className="px-4 py-2">
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-red-500 hover:bg-red-600/20 rounded"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};