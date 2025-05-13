"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Edit, Trash, GripVertical, Plus, Save, AlertCircle, Undo2, Redo2 } from "lucide-react"
import { showSuccessToast, showErrorToast } from "@/components/notify/Toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ManageCategoriesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCategoriesUpdated?: () => void
}

// Define the types of operations for history tracking
type CategoryOperation =
  | { type: "add"; category: string; index: number }
  | { type: "delete"; category: string; index: number }
  | { type: "rename"; oldName: string; newName: string; index: number }
  | { type: "move"; category: string; fromIndex: number; toIndex: number }

export function ManageCategoriesModal({ open, onOpenChange, onCategoriesUpdated }: ManageCategoriesModalProps) {
  const [categories, setCategories] = useState<string[]>([])
  const [originalCategories, setOriginalCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [originalDragIndex, setOriginalDragIndex] = useState<number | null>(null) // Track original position
  const [error, setError] = useState<string | null>(null)

  // New states for undo/redo and pending deletions
  const [pendingDeletions, setPendingDeletions] = useState<Set<string>>(new Set())
  const [history, setHistory] = useState<CategoryOperation[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false)

  // Fetch categories when modal opens
  useEffect(() => {
    if (open) {
      fetchCategories()
    }
  }, [open])

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/products/categories")
      const data = await response.json()
      if (data.success) {
        // Ensure "Other" is always at the end
        let fetchedCategories = [...data.categories]
        // If "Other" exists, move it to the end
        if (fetchedCategories.includes("Other")) {
          fetchedCategories = fetchedCategories.filter((cat) => cat !== "Other")
          fetchedCategories.push("Other")
        }

        setCategories(fetchedCategories)
        setOriginalCategories(fetchedCategories)
        // Reset history and pending deletions when fetching new data
        setHistory([])
        setHistoryIndex(-1)
        setPendingDeletions(new Set())
      } else {
        setError(data.message || "Failed to fetch categories")
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      setError("An error occurred while fetching categories")
    } finally {
      setLoading(false)
    }
  }

  // Add operation to history
  const addToHistory = useCallback(
    (operation: CategoryOperation) => {
      // If we're not at the end of the history, truncate it
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(operation)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [history, historyIndex],
  )

  // Undo the last operation
  const handleUndo = useCallback(() => {
    if (historyIndex < 0) return

    const operation = history[historyIndex]
    const newCategories = [...categories]
    const newPendingDeletions = new Set(pendingDeletions)

    switch (operation.type) {
      case "add":
        // Remove the added category
        newCategories.splice(operation.index, 1)
        break
      case "delete":
        // Restore the deleted category
        newCategories.splice(operation.index, 0, operation.category)
        newPendingDeletions.delete(operation.category)
        break
      case "rename":
        // Restore the old name
        newCategories[operation.index] = operation.oldName
        break
      case "move":
        // Move the category back to its original position
        const [movedItem] = newCategories.splice(operation.toIndex, 1)
        newCategories.splice(operation.fromIndex, 0, movedItem)
        break
    }

    setCategories(newCategories)
    setPendingDeletions(newPendingDeletions)
    setHistoryIndex(historyIndex - 1)
  }, [historyIndex, history, categories, pendingDeletions])

  // Redo the last undone operation
  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return

    const operation = history[historyIndex + 1]
    const newCategories = [...categories]
    const newPendingDeletions = new Set(pendingDeletions)

    switch (operation.type) {
      case "add":
        // Add the category again
        newCategories.splice(operation.index, 0, operation.category)
        break
      case "delete":
        // Delete the category again
        newCategories.splice(operation.index, 1)
        newPendingDeletions.add(operation.category)
        break
      case "rename":
        // Apply the new name again
        newCategories[operation.index] = operation.newName
        break
      case "move":
        // Move the category to the new position again
        const [movedItem] = newCategories.splice(operation.fromIndex, 1)
        newCategories.splice(operation.toIndex, 0, movedItem)
        break
    }

    setCategories(newCategories)
    setPendingDeletions(newPendingDeletions)
    setHistoryIndex(historyIndex + 1)
  }, [historyIndex, history, categories, pendingDeletions])

  const handleAddCategory = () => {
    // Find the index of "Other" category if it exists
    const otherIndex = categories.findIndex((cat) => cat === "Other")

    // Determine where to insert the new category
    // If "Other" exists, insert before it, otherwise add to the end
    const insertIndex = otherIndex !== -1 ? otherIndex : categories.length

    // Create a new array with the empty category inserted at the right position
    const newCategories = [...categories]
    newCategories.splice(insertIndex, 0, "")

    setCategories(newCategories)
    setEditingIndex(insertIndex)
    setEditValue("")

    // Add to history
    addToHistory({ type: "add", category: "", index: insertIndex })
  }

  const handleStartEdit = (index: number) => {
    if (categories[index] === "Other") return
    setEditingIndex(index)
    setEditValue(categories[index])
  }

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      showErrorToast("Category name cannot be empty")
      return
    }

    if (categories.findIndex((cat, i) => cat === editValue.trim() && i !== editingIndex) !== -1) {
      showErrorToast("Category already exists")
      return
    }

    const newCategories = [...categories]
    if (editingIndex !== null) {
      const oldName = newCategories[editingIndex]
      const newName = editValue.trim()

      // Only add to history if the name actually changed
      if (oldName !== newName) {
        // If this is a new category (empty string), it's an add operation
        if (oldName === "") {
          addToHistory({ type: "add", category: newName, index: editingIndex })
        } else {
          // Otherwise it's a rename operation
          addToHistory({ type: "rename", oldName, newName, index: editingIndex })
        }
      }

      newCategories[editingIndex] = newName
      setCategories(newCategories)
      setEditingIndex(null)
      setEditValue("")
    }
  }

  const handleCancelEdit = () => {
    // If we're canceling the edit of a newly added empty category, remove it
    if (editingIndex !== null && categories[editingIndex] === "") {
      const newCategories = [...categories]
      newCategories.splice(editingIndex, 1)
      setCategories(newCategories)

      // Remove the add operation from history
      if (historyIndex >= 0 && history[historyIndex].type === "add") {
        setHistory(history.slice(0, historyIndex))
        setHistoryIndex(historyIndex - 1)
      }
    }
    setEditingIndex(null)
    setEditValue("")
  }

  const handleMarkForDeletion = (category: string, index: number) => {
    if (category === "Other") return

    // Mark for pending deletion instead of immediate deletion
    const newPendingDeletions = new Set(pendingDeletions)
    newPendingDeletions.add(category)
    setPendingDeletions(newPendingDeletions)

    // Remove from current list
    const newCategories = [...categories]
    newCategories.splice(index, 1)
    setCategories(newCategories)

    // Add to history
    addToHistory({ type: "delete", category, index })
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
    setOriginalDragIndex(index) // Store the original position
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    // Find the index of "Other" category
    const otherIndex = categories.findIndex((cat) => cat === "Other")

    // Prevent dropping after "Other" category
    // If the target index is the "Other" category or beyond, don't allow the drop
    if (categories[index] === "Other" || (otherIndex !== -1 && index > otherIndex)) {
      return
    }

    // Prevent moving an item to a position that would place it after "Other"
    // If we're moving from before "Other" to after it
    if (otherIndex !== -1 && draggedIndex < otherIndex && index > otherIndex) {
      return
    }

    const newCategories = [...categories]
    const draggedItem = newCategories[draggedIndex]

    // Remove the dragged item
    newCategories.splice(draggedIndex, 1)
    // Insert it at the new position
    newCategories.splice(index, 0, draggedItem)

    setCategories(newCategories)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    // Only add to history if the item was actually moved to a different position
    if (draggedIndex !== null && originalDragIndex !== null && draggedIndex !== originalDragIndex) {
      // Add move operation to history
      addToHistory({
        type: "move",
        category: categories[draggedIndex],
        fromIndex: originalDragIndex,
        toIndex: draggedIndex,
      })
    }

    setDraggedIndex(null)
    setOriginalDragIndex(null)
  }

  const handleSaveChangesRequest = () => {
    if (pendingDeletions.size > 0) {
      // Show confirmation dialog if there are pending deletions
      setSaveConfirmOpen(true)
    } else {
      // Otherwise proceed directly to save
      handleSaveChanges()
    }
  }

  const handleSaveChanges = async () => {
    if (JSON.stringify(categories) === JSON.stringify(originalCategories) && pendingDeletions.size === 0) {
      onOpenChange(false)
      return
    }

    setSaving(true)
    setError(null)
    setSaveConfirmOpen(false)

    try {
      // Ensure "Other" is always at the end of the list
      let finalCategories = [...categories]

      // Remove "Other" if it exists in the array
      finalCategories = finalCategories.filter((cat) => cat !== "Other")

      // Add "Other" at the end
      finalCategories.push("Other")

      const response = await fetch("/api/products/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categories: finalCategories }),
      })

      const data = await response.json()
      if (data.success) {
        showSuccessToast("Categories updated successfully")
        setOriginalCategories(finalCategories)
        setCategories(finalCategories)
        setPendingDeletions(new Set())
        setHistory([])
        setHistoryIndex(-1)
        if (onCategoriesUpdated) {
          onCategoriesUpdated()
        }
        onOpenChange(false)
      } else {
        setError(data.message || "Failed to update categories")
      }
    } catch (error) {
      console.error("Error updating categories:", error)
      setError("An error occurred while updating categories")
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = JSON.stringify(categories) !== JSON.stringify(originalCategories) || pendingDeletions.size > 0

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl max-h-[90vh] overflow-hidden flex flex-col focus:outline-none focus:ring-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Manage Categories</DialogTitle>
          </DialogHeader>

          {/* Fixed instruction text */}
          <div className="mb-4 border-b border-zinc-800 pb-2">
            <p className="text-sm text-zinc-400">
              Drag and drop to reorder categories. Changes will only be saved when you click the Save button.
            </p>

            {error && (
              <div className="mt-3 p-3 bg-red-900/30 border border-red-700 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {pendingDeletions.size > 0 && (
              <div className="mt-3 p-3 bg-amber-900/30 border border-amber-700 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-amber-200 text-sm">
                  {pendingDeletions.size} {pendingDeletions.size === 1 ? "category" : "categories"} marked for deletion.
                  Changes will be applied when you save.
                </p>
              </div>
            )}
          </div>

          {/* Undo/Redo controls */}
          <div className="flex items-center mb-1 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={historyIndex < 0 || loading || saving || editingIndex !== null}
              className="border-zinc-700 text-zinc-300"
            >
              <Undo2 className="h-4 w-4 mr-1" />
              Undo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1 || loading || saving || editingIndex !== null}
              className="border-zinc-700 text-zinc-300"
            >
              <Redo2 className="h-4 w-4 mr-1" />
              Redo
             </Button>

            <div className="text-xs text-zinc-500 ml-2">
              {history.length > 0 ? `${historyIndex + 1}/${history.length} changes` : "No changes"}
            </div>

             <Button
              onClick={handleAddCategory}
              variant="noting"
              className="bg-cyan-700 hover:bg-zinc-600 text-white ml-auto"
              disabled={loading || editingIndex !== null}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Scrollable list of categories */}
          <div className="flex-1 overflow-y-auto py-2 pr-2">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    draggable={editingIndex !== index && category !== "Other"}
                    onDragStart={() => (category !== "Other" ? handleDragStart(index) : null)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center p-2 rounded-md border ${
                      draggedIndex === index ? "border-red-500 bg-red-900/20" : "border-zinc-700 hover:border-zinc-600"
                    } ${category === "Other" ? "bg-zinc-800/50" : ""}`}
                  >
                    <div
                      className={`cursor-move p-1 text-zinc-500 hover:text-zinc-300 ${category === "Other" ? "opacity-50" : ""}`}
                    >
                      <GripVertical className="h-5 w-5" />
                    </div>

                    {editingIndex === index ? (
                      <div className="flex-1 flex items-center">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="flex-1 bg-zinc-800 border-zinc-700"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleSaveEdit()
                            } else if (e.key === "Escape") {
                              handleCancelEdit()
                            }
                          }}
                        />
                        <div className="flex ml-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleSaveEdit}
                            className="h-10 w-10 p-0 text-green-500 hover:text-green-400 hover:bg-green-900/20"
                          >
                            <Save className="h-10 w-10" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancelEdit}
                            className="h-10 w-10 p-0 text-zinc-500 hover:text-zinc-400 hover:bg-zinc-800"
                          >
                            <X className="h-10 w-10" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="flex-1 px-2">{category}</span>
                        <div className="flex">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStartEdit(index)}
                            className="h-10 w-10 p-0 text-blue-500 hover:text-blue-400 hover:bg-blue-900/20"
                            disabled={category === "Other"}
                          >
                            <Edit className={`h-10 w-10 ${category === "Other" ? "opacity-50" : ""}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkForDeletion(category, index)}
                            className="h-10 w-10 p-0 text-red-500 hover:text-red-400 hover:bg-red-900/20"
                            disabled={category === "Other"}
                          >
                            <Trash className={`h-10 w-10 ${category === "Other" ? "opacity-50" : ""}`} />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-zinc-800 flex justify-between">
            

            <div className="flex space-x-2 ml-auto">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-zinc-700"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveChangesRequest}
                className={`${hasChanges ? "bg-red-600 hover:bg-red-700" : "bg-zinc-700 hover:bg-zinc-600"}`}
                disabled={saving || !hasChanges || editingIndex !== null}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for save with pending deletions */}
      <AlertDialog open={saveConfirmOpen} onOpenChange={setSaveConfirmOpen}>
        <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              You are about to delete {pendingDeletions.size} {pendingDeletions.size === 1 ? "category" : "categories"}.
              Products in these categories will be moved to "Other". This action cannot be undone. Are you sure you want
              to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleSaveChanges}>
              Yes, Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
