"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ProfilePictureUpload } from "@/components/user/profile-picture-upload"
import { Skeleton } from "@/components/ui/skeleton"
import { userService } from "@/lib/api/user-service"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user: authUser, refreshUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")

  useEffect(() => {
    if (authUser) {
      setUsername(authUser.name || "")
    }
  }, [authUser])

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await userService.updateProfile({ username })
      await refreshUser()
      toast.success("Username updated successfully")
    } catch (err) {
      console.error("Update error:", err)
      toast.error("Failed to update username")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfilePictureUpdate = async () => {
    await refreshUser()
  }

  if (!authUser) {
    return (
      <div className="container mx-auto max-w-2xl space-y-6 p-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-24 rounded-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload or change your profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <ProfilePictureUpload user={authUser} onUpdate={handleProfilePictureUpdate} />
            <div className="text-sm text-muted-foreground">
              <p>Click on your avatar to upload a new picture</p>
              <p>or provide an image URL</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateUsername} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={authUser.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <Button type="submit" disabled={isLoading || username === authUser.name}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
