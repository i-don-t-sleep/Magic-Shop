"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Publisher } from "@/components/publisher-row";

interface AddPublisherPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (pub: Publisher) => void;
}

export default function AddPublisherPopup({ isOpen, onClose, onAdd }: AddPublisherPopupProps) {
  if (!isOpen) return null;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [sessionState, setSessionState] = useState<"Online" | "Offline">("Online");
  const [servicesFee, setServicesFee] = useState<number>(0);
  const [publisherWeb, setPublisherWeb] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/publishers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          name,
          password,
          email,
          phone,
          city,
          country,
          postalCode,
          sessionState,
          servicesFee,
          publisherWeb,
          description,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      onAdd(data.publisher);
      onClose();
    } catch (err: any) {
      setError(err.message || "Add failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 text-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Add Publisher</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            placeholder="Phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
          <Input
            placeholder="City"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <Input
            placeholder="Country"
            value={country}
            onChange={e => setCountry(e.target.value)}
          />
          <Input
            placeholder="Postal Code"
            value={postalCode}
            onChange={e => setPostalCode(e.target.value)}
          />
          <div>
            <label className="block mb-1">Session State</label>
            <select
              value={sessionState}
              onChange={e => setSessionState(e.target.value as "Online" | "Offline")}
              className="bg-zinc-700 text-white rounded w-full p-2"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
          <Input
            type="number"
            placeholder="Service Fee %"
            value={servicesFee}
            onChange={e => setServicesFee(Number(e.target.value))}
          />
          <Input
            placeholder="Website URL"
            value={publisherWeb}
            onChange={e => setPublisherWeb(e.target.value)}
          />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="bg-zinc-700 text-zinc-300 placeholder:text-zinc-500"
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}