"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { User as UserIcon, Upload, Loader2 } from "lucide-react"
import { imageService } from "@/lib/api/image-service"
import { userService } from "@/lib/api/user-service"
import { toast } from "sonner"
import type { User } from "@/lib/types"

interface ProfilePictureUploadProps {
  user: User
  onUpdate?: (user: User) => void
}

export function ProfilePictureUpload({ user, onUpdate }: ProfilePictureUploadProps) {
  const [open, setOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(user.profilePictureUrl || "")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB")
        return
      }
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile && !imageUrl) {
      toast.error("Please select an image or enter a URL")
      return
    }

    setIsUploading(true)

    try {
      let finalImageUrl = imageUrl

      // If file is selected, upload to Cloudinary
      if (selectedFile) {
        const uploadedUrl = await imageService.uploadImage(selectedFile)
        finalImageUrl = uploadedUrl
      }

      // Update user profile with new image URL
      const updatedUser = await userService.updateProfile({
        profilePictureUrl: finalImageUrl,
      })

      // Update local storage
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        parsedUser.profilePictureUrl = finalImageUrl
        localStorage.setItem("user", JSON.stringify(parsedUser))
      }

      toast.success("Profile picture updated successfully")
      onUpdate?.(updatedUser)
      setOpen(false)
      setSelectedFile(null)
    } catch (err) {
      console.error("Upload error:", err)
      toast.error("Failed to update profile picture")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="group relative cursor-pointer">
          <Avatar className="h-24 w-24 transition-opacity group-hover:opacity-75">
            <AvatarImage src={user.profilePictureUrl || undefined} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {user.profilePictureUrl ? <UserIcon className="h-12 w-12" /> : initials}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Upload className="h-8 w-8 text-white" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={selectedFile ? URL.createObjectURL(selectedFile) : imageUrl || undefined} alt="Preview" />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload Image</Label>
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <p className="text-xs text-muted-foreground">Max size: 5MB. Supported: JPG, PNG, GIF</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={isUploading || !!selectedFile}
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading} className="flex-1">
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
