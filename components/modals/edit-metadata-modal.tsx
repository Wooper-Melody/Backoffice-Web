"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditMetadataModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: any
  onSave: (item: any) => void
}

export function EditMetadataModal({ open, onOpenChange, item, onSave }: EditMetadataModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    collection: "",
    genre: "",
    description: "",
    tags: "",
    publishDate: "",
    status: "",
  })

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || "",
        artist: item.artist || "",
        collection: item.collection || "",
        genre: item.genre || "",
        description: item.description || "",
        tags: item.tags || "",
        publishDate: item.publishDate || "",
        status: item.status || "",
      })
    }
  }, [item])

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/catalog/${item.id}/metadata`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSave({ ...item, ...formData })
      }
    } catch (error) {
      console.error("Error updating metadata:", error)
    }
  }

  const handleCancel = () => {
    if (item) {
      setFormData({
        title: item.title || "",
        artist: item.artist || "",
        collection: item.collection || "",
        genre: item.genre || "",
        description: item.description || "",
        tags: item.tags || "",
        publishDate: item.publishDate || "",
        status: item.status || "",
      })
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Metadata</DialogTitle>
          <DialogDescription>Update the metadata for "{item?.title}"</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist">Artist</Label>
              <Input
                id="artist"
                value={formData.artist}
                onChange={(e) => setFormData((prev) => ({ ...prev, artist: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="collection">Collection</Label>
              <Input
                id="collection"
                value={formData.collection}
                onChange={(e) => setFormData((prev) => ({ ...prev, collection: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input
                id="genre"
                value={formData.genre}
                onChange={(e) => setFormData((prev) => ({ ...prev, genre: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                placeholder="pop, electronic, dance"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Region-unavailable">Region unavailable</SelectItem>
                  <SelectItem value="Admin-blocked">Admin blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishDate">Publish Date</Label>
            <Input
              id="publishDate"
              type="date"
              value={formData.publishDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, publishDate: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
