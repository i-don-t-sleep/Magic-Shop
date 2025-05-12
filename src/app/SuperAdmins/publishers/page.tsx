"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Grid, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingComp } from "@/components/loading-comp";
import AddPublisherPopup from "./pop";
import { Publisher, PublisherRow } from "@/components/publisher-row";

export default function PublishersPage() {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPublishers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/publishers");
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setPublishers(data.publishers);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  const handleAdd = (pub: Publisher) => {
    setPublishers((prev) => [pub, ...prev]);
  };

  const handleSelect = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/publishers?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setPublishers((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } catch (e: any) {
      console.error("Delete failed:", e);
      alert(`Delete failed: ${e.message}`);
    }
  };

  const filteredUsers = publishers.filter(p =>
    [p.name].some(field =>
      field.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
  );
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (loading) return <LoadingComp />;

  const filtered = publishers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex mb-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 mr-2"
        />
        <Button onClick={() => setOpenAdd(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>

      <AddPublisherPopup
        isOpen={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdd={handleAdd}
      />
      <div className="bg-zinc-900 rounded-lg overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full table-auto min-w-full">
            <thead className="sticky top-0 bg-zinc-900 z-10">
              <tr className="border-b border-zinc-800">
                {/* <th className="px-4 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={
                        currentUsers.length > 0 &&
                        currentUsers.every(u => selectedIds.includes(u.id))
                      }
                      onChange={e => {
                        const checked = e.target.checked;
                        if (checked) {
                          setSelectedIds([
                            ...new Set([
                              ...selectedIds,
                              ...currentUsers.map(u => u.id)
                            ])
                          ]);
                        } else {
                          setSelectedIds(
                            selectedIds.filter(id =>
                              !currentUsers.some(u => u.id === id)
                            )
                          );
                        }
                      }}
                    />
                  </th> */}
                <th className="px-4 py-2 text-left font-medium">
                  Logo
                </th>
                <th className="px-4 py-2 text-left font-medium">
                  Username
                </th>
                <th className="px-4 py-2 text-left font-medium">
                  Name
                </th>
                <th className="px-4 py-2 text-left font-medium">
                  Email
                </th>
                <th className="px-4 py-2 text-left font-medium">
                  Phone
                </th>
                <th className="px-4 py-2 text-left font-medium">
                  Location
                </th>
                <th className="px-4 py-2 text-left font-medium">
                  Session
                </th>
                <th className="px-4 py-2 text-left font-medium">
                  Fee
                </th>
                <th className="px-4 py-2 text-left font-medium">
                  Website
                </th>
                <th className="px-4 py-2 text-left font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((pub) => (
                <PublisherRow
                  key={pub.id}
                  publisher={pub}
                  selected={selectedIds.includes(pub.id)}
                  onSelect={(checked) => handleSelect(pub.id, checked)}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
