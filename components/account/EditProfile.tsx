"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Mail, Calendar, Pencil, X } from "lucide-react";

{
  /* Profile Overview Card */
}
export function ProfileOverview({ user }: { user: any }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profileImage: user.profileImage,
  });

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    // Reset form to original values when closed without saving
    setEditedUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImage: user.profileImage,
    });
  };

  const handleSaveChanges = () => {
    // Here you would typically update the user data
    console.log("Saving changes:", editedUser);
    setIsEditDialogOpen(false);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="overflow-hidden border shadow-sm rounded-xl bg-background">
        <div className="relative p-4 md:p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between pb-10">
            {/* Left Section */}
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end ">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-background ring-2 ring-primary/20 md:h-24 md:w-24">
                  <AvatarImage
                    src={user.profileImage}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary md:text-xl">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-background shadow-md transition-all hover:scale-110 hover:shadow-lg md:h-8 md:w-8"
                >
                  <Camera className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </Button>
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <h2 className="text-xl font-bold tracking-tight md:text-2xl">
                  {user.firstName} {user.lastName}
                </h2>

                <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-4">
                  <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                    <Mail className="h-4 w-4 text-primary/60" />
                    <span className="text-xs font-medium md:text-sm">
                      {user.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                    <Calendar className="h-4 w-4 text-primary/60" />
                    <span className="text-xs font-medium md:text-sm">
                      Joined {user.joinDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleEditClick}
              className="w-full gap-2 border-primary/20 bg-primary/5 font-medium text-primary transition-all hover:bg-primary/10 hover:text-primary sm:w-auto"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile information here. Click save when
              you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Profile Image Preview */}
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary/20">
                  <AvatarImage
                    src={editedUser.profileImage || user.profileImage}
                    alt={`${editedUser.firstName} ${editedUser.lastName}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                    {editedUser.firstName?.[0]}
                    {editedUser.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-background shadow-md"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* First Name Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={editedUser.firstName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Last Name Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={editedUser.lastName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Email Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={editedUser.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>

            {/* Join Date (Read-only) */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="joinDate" className="text-right">
                Joined
              </Label>
              <Input
                id="joinDate"
                value={user.joinDate}
                disabled
                className="col-span-3 bg-muted"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
