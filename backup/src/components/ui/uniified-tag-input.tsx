"use client";

import * as React from "react";
import { X, ChevronDown, Check, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export type FilterOption = {
  value: string;
  label: string;
  type: string;
  typeLabel: string;
  color?: string;
};

export type FilterTag = {
  value: string;
  label: string;
  type: string;
  typeLabel: string;
};

export interface UnifiedTagInputProps {
  placeholder?: string;
  disabled?: boolean;
  options: FilterOption[];
  selectedTags: FilterTag[];
  onTagSelect: (tag: FilterTag) => void;
  onTagRemove: (tag: FilterTag) => void;
  className?: string;
  /** ความสูงสูงสุดของ dropdown hint (string เช่น '300px') */
  maxHeight?: string;
}

export function UnifiedTagInput({
  placeholder = "Add filters...",
  disabled = false,
  options,
  selectedTags,
  onTagSelect,
  onTagRemove,
  className,
  maxHeight = "300px",
}: UnifiedTagInputProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSelect = (option: FilterOption) => {
    const isSelected = selectedTags.some(
      (tag) => tag.value === option.value && tag.type === option.type
    );
    if (!isSelected) {
      onTagSelect({
        value: option.value,
        label: option.label,
        type: option.type,
        typeLabel: option.typeLabel,
      });
    }
    setOpen(false);
    setSearchQuery("");
  };

  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, FilterOption[]> = {};
    options.forEach((option) => {
      if (!groups[option.type]) groups[option.type] = [];
      const isSelected = selectedTags.some(
        (tag) => tag.value === option.value && tag.type === option.type
      );
      if (!isSelected || option.type === "sort") {
        groups[option.type].push(option);
      }
    });
    return groups;
  }, [options, selectedTags]);

  const filteredGroups = React.useMemo(() => {
    if (!searchQuery) return groupedOptions;
    const filtered: Record<string, FilterOption[]> = {};
    Object.entries(groupedOptions).forEach(([type, opts]) => {
      const match = opts.filter(
        (o) =>
          o.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.typeLabel.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (match.length) filtered[type] = match;
    });
    return filtered;
  }, [groupedOptions, searchQuery]);

  const getTagColor = (type: string) => {
    switch (type) {
      case "category": return "bg-blue-100 text-blue-800 border-blue-300";
      case "publisher": return "bg-purple-100 text-purple-800 border-purple-300";
      case "status": return "bg-green-100 text-green-800 border-green-300";
      case "sort": return "bg-amber-100 text-amber-800 border-amber-300";
      case "price": return "bg-red-100 text-red-800 border-red-300";
      case "quantity": return "bg-indigo-100 text-indigo-800 border-indigo-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* tags container: allow horizontal scroll if overflow */}
      <div
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md bg-white px-3 py-2 text-sm text-black ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={() => !disabled && setOpen(!open)}
      >
        {selectedTags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {selectedTags.map((tag) => (
              <div
                key={`${tag.type}-${tag.value}`}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-1 text-xs border",
                  getTagColor(tag.type)
                )}
              >
                <span className="font-semibold">{tag.typeLabel}:</span>
                <span>{tag.label}</span>
                <button
                  type="button"
                  className="text-zinc-500 hover:text-zinc-700 ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagRemove(tag);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center text-zinc-500">
            <Tag className="h-4 w-4 mr-2" />
            <span>{placeholder}</span>
          </div>
        )}
        <div className="ml-auto flex items-center self-stretch pl-2">
          <ChevronDown className="h-4 w-4 opacity-50" />
        </div>
      </div>

      {open && (
        /* dropdown: limit height and allow vertical scroll */
        <div
          className="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg"
          style={{ maxHeight: maxHeight}}
        >
          <Command className="bg-transparent">
            <CommandInput
              placeholder="Search filters..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No matching filters found.</CommandEmpty>

              {Object.entries(filteredGroups).map(([type, typeOptions], gi) => (
                <React.Fragment key={type}>
                  {gi > 0 && <CommandSeparator />}
                  <CommandGroup heading={typeOptions[0]?.typeLabel || type}>
                    {typeOptions.map((opt) => (
                      <CommandItem
                        key={`${opt.type}-${opt.value}`}
                        value={`${opt.type}-${opt.value}`}
                        onSelect={() => handleSelect(opt)}
                        className="flex items-center justify-between hover:bg-zinc-100"
                      >
                        <div className="flex items-center">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full mr-2",
                              opt.type === "category"
                                ? "bg-blue-500"
                                : opt.type === "publisher"
                                ? "bg-purple-500"
                                : opt.type === "status"
                                ? "bg-green-500"
                                : opt.type === "sort"
                                ? "bg-amber-500"
                                : opt.type === "price"
                                ? "bg-red-500"
                                : opt.type === "quantity"
                                ? "bg-indigo-500"
                                : "bg-gray-500",
                            )}
                          />
                          <span>{opt.label}</span>
                        </div>
                        {selectedTags.some(
                          (t) => t.value === opt.value && t.type === opt.type
                        ) && <Check className="h-4 w-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </React.Fragment>
              ))}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
