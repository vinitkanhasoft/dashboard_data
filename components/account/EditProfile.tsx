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

export function ProfileOverview({ user }: { user: any }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [editedUser, setEditedUser] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profileImage: user.profileImage,
  });

  const handleEditClick = () => setIsEditDialogOpen(true);

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setEditedUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profileImage: user.profileImage,
    });
  };

  const handleSaveChanges = () => {
    console.log("Saving changes:", editedUser);
    setIsEditDialogOpen(false);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {/* ================= PROFILE CARD ================= */}
      <Card className="overflow-hidden ">
        <CardContent className="relative p-4 sm:p-6 md:p-8">
          <div className="absolute inset-0  pointer-events-none" />

          {/* Responsive layout */}
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            
            {/* LEFT SECTION */}
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center lg:items-end w-full">
              
              {/* Avatar */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/60 rounded-full blur-lg opacity-20" />

                <Avatar className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 border-4 border-white dark:border-gray-800 shadow-xl">
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white text-lg font-semibold">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>

                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white dark:bg-gray-800 shadow-lg"
                >
                  <Camera className="h-4 w-4 text-primary" />
                </Button>
              </div>

              {/* User Info */}
              <div className="space-y-2 text-center sm:text-left w-full min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent break-words">
                  {user.firstName} {user.lastName}
                </h2>

                {/* Info Pills */}
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  
                  <div className="flex items-center justify-center sm:justify-start gap-2 bg-white/60 dark:bg-gray-800/60 px-3 py-1.5 rounded-full shadow-sm max-w-full">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-xs sm:text-sm truncate">
                      {user.email}
                    </span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2 bg-white/60 dark:bg-gray-800/60 px-3 py-1.5 rounded-full shadow-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-xs sm:text-sm">
                      Joined {user.joinDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* EDIT BUTTON */}
            <Button
              variant="outline"
              onClick={handleEditClick}
              className="
                w-full lg:w-auto
                gap-2
                border-2 border-primary/20
                bg-white dark:bg-gray-800
                font-semibold text-primary
                hover:bg-primary hover:text-white
                transition-all
                rounded-xl
                py-2.5 px-6
              "
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ================= EDIT DIALOG ================= */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent
          className="
            w-[95vw]
            max-w-lg
            p-0
            rounded-2xl
            overflow-hidden
            max-h-[90vh]
            flex flex-col
          "
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-primary to-primary/60 px-5 sm:px-6 py-4">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-bold text-white">
                Edit Profile
              </DialogTitle>
              <DialogDescription className="text-white/90 text-xs sm:text-sm">
                Update your profile information.
              </DialogDescription>
            </DialogHeader>

            <button
              onClick={handleCloseDialog}
              className="absolute right-4 top-4 rounded-full p-1.5 bg-white/20 hover:bg-white/30"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>

          {/* SCROLLABLE BODY */}
          <div className="px-5 sm:px-6 py-6 overflow-y-auto space-y-5">

            {/* Avatar Preview */}
            <div className="flex justify-center">
              <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white dark:border-gray-800 shadow-xl">
                <AvatarImage src={editedUser.profileImage} />
                <AvatarFallback>
                  {editedUser.firstName?.[0]}
                  {editedUser.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* FORM */}
            <div className="space-y-4">

              <div className="space-y-2">
                <Label>First Name</Label>
                <Input
                  name="firstName"
                  value={editedUser.firstName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input
                  name="lastName"
                  value={editedUser.lastName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Member Since</Label>
                <Input disabled value={user.joinDate} />
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <DialogFooter className="px-5 sm:px-6 py-4 border-t bg-gray-50 dark:bg-gray-800/50">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                className="w-full"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSaveChanges}
                className="w-full bg-gradient-to-r from-primary to-primary/80 text-white"
              >
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}