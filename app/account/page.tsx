import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Bell,
  CreditCard,
  Lock,
  Key,
  Smartphone,
  Camera,
  Pencil,
  Save,
  Github,
  Chrome,
  Globe,
} from "lucide-react";

import data from "./../../app/dashboard/data.json";
import { ProfileOverview } from "@/components/account/EditProfile";

export default function Page() {
  // Mock user data - replace with actual user data from your auth system
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Apt 4B, New York, NY 10001",
    dateOfBirth: "1990-01-15",
    joinDate: "January 2024",
    profileImage: "/avatars/user.jpg",
    role: "Premium Member",
    twoFactorEnabled: true,
    emailVerified: true,
    phoneVerified: true,
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 56)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-6  ">
            {/* Page Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Account Settings
                </h1>
                <p className="text-sm text-muted-foreground md:text-base">
                  Manage your account settings and preferences
                </p>
              </div>
              <Badge variant="secondary" className="w-fit px-3 py-1">
                {user.role}
              </Badge>
            </div>

            <Separator className="my-0" />

            {/* Profile Overview Card */}
            <ProfileOverview user={user} />

            {/* Main Content Tabs */}
            <Tabs
              defaultValue="profile"
              className="flex h-full flex-col space-y-6"
            >
              {/* Tabs Header */}
              <div className="overflow-x-auto scrollbar-hide h-12">
                <TabsList
                  className="
        flex h-12 w-full min-w-max items-center
        rounded-xl bg-muted p-1
        sm:grid sm:w-auto sm:grid-cols-4
      "
                >
                  {/* PROFILE */}
                  <TabsTrigger
                    value="profile"
                    className="
          flex h-full items-center justify-center gap-2
          rounded-lg px-4 text-sm font-medium
          transition-all duration-200
          data-[state=active]:bg-black
          data-[state=active]:text-white
          data-[state=active]:shadow-sm
          hover:bg-muted/70
        "
                  >
                    <User className="h-4 w-4 shrink-0" />
                    <span>Profile</span>
                  </TabsTrigger>

                  {/* SECURITY */}
                  <TabsTrigger
                    value="security"
                    className="
          flex h-full items-center justify-center gap-2
          rounded-lg px-4 text-sm font-medium
          transition-all duration-200
          data-[state=active]:bg-black
          data-[state=active]:text-white
          data-[state=active]:shadow-sm
          hover:bg-muted/70
        "
                  >
                    <Shield className="h-4 w-4 shrink-0" />
                    <span>Security</span>
                  </TabsTrigger>

                  {/* NOTIFICATIONS */}
                  <TabsTrigger
                    value="notifications"
                    className="
          flex h-full items-center justify-center gap-2
          rounded-lg px-4 text-sm font-medium
          transition-all duration-200
          data-[state=active]:bg-black
          data-[state=active]:text-white
          data-[state=active]:shadow-sm
          hover:bg-muted/70
        "
                  >
                    <Bell className="h-4 w-4 shrink-0" />
                    <span>Notifications</span>
                  </TabsTrigger>

                  {/* BILLING */}
                  <TabsTrigger
                    value="billing"
                    className="
          flex h-full items-center justify-center gap-2
          rounded-lg px-4 text-sm font-medium
          transition-all duration-200
          data-[state=active]:bg-black
          data-[state=active]:text-white
          data-[state=active]:shadow-sm
          hover:bg-muted/70
        "
                  >
                    <CreditCard className="h-4 w-4 shrink-0" />
                    <span>Billing</span>
                  </TabsTrigger>
                </TabsList>
              </div>
              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader className="space-y-1 p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl">
                      Personal Information
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Update your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-xs md:text-sm"
                        >
                          First Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground md:h-4 md:w-4" />
                          <Input
                            id="firstName"
                            defaultValue={user.firstName}
                            className="pl-8 text-sm md:pl-9 md:text-base"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-xs md:text-sm"
                        >
                          Last Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground md:h-4 md:w-4" />
                          <Input
                            id="lastName"
                            defaultValue={user.lastName}
                            className="pl-8 text-sm md:pl-9 md:text-base"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs md:text-sm">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground md:h-4 md:w-4" />
                        <Input
                          id="email"
                          type="email"
                          defaultValue={user.email}
                          className="pl-8 text-sm md:pl-9 md:text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs md:text-sm">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground md:h-4 md:w-4" />
                        <Input
                          id="phone"
                          type="tel"
                          defaultValue={user.phone}
                          className="pl-8 text-sm md:pl-9 md:text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-xs md:text-sm">
                        Address
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground md:h-4 md:w-4" />
                        <Input
                          id="address"
                          defaultValue={user.address}
                          className="pl-8 text-sm md:pl-9 md:text-base"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob" className="text-xs md:text-sm">
                        Date of Birth
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground md:h-4 md:w-4" />
                        <Input
                          id="dob"
                          type="date"
                          defaultValue={user.dateOfBirth}
                          className="pl-8 text-sm md:pl-9 md:text-base"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button size="sm" className="w-full gap-2 sm:w-auto">
                        <Save className="h-3 w-3 md:h-4 md:w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="space-y-1 p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl">
                      Connected Accounts
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Link your accounts for seamless integration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
                    {[
                      { name: "Google", icon: Chrome, connected: true },
                      { name: "GitHub", icon: Github, connected: false },
                      { name: "Microsoft", icon: Globe, connected: false },
                    ].map((account) => (
                      <div
                        key={account.name}
                        className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted md:h-10 md:w-10">
                            <account.icon className="h-3 w-3 md:h-4 md:w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium md:text-base">
                              {account.name}
                            </p>
                            <p className="text-xs text-muted-foreground md:text-sm">
                              {account.connected
                                ? "Connected"
                                : "Not connected"}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant={account.connected ? "outline" : "default"}
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          {account.connected ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader className="space-y-1 p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl">
                      Change Password
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
                    <div className="space-y-2">
                      <Label
                        htmlFor="current-password"
                        className="text-xs md:text-sm"
                      >
                        Current Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground md:h-4 md:w-4" />
                        <Input
                          id="current-password"
                          type="password"
                          className="pl-8 text-sm md:pl-9 md:text-base"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="new-password"
                        className="text-xs md:text-sm"
                      >
                        New Password
                      </Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground md:h-4 md:w-4" />
                        <Input
                          id="new-password"
                          type="password"
                          className="pl-8 text-sm md:pl-9 md:text-base"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirm-password"
                        className="text-xs md:text-sm"
                      >
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground md:h-4 md:w-4" />
                        <Input
                          id="confirm-password"
                          type="password"
                          className="pl-8 text-sm md:pl-9 md:text-base"
                        />
                      </div>
                    </div>
                    <Button className="w-full sm:w-auto">
                      Update Password
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="space-y-1 p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl">
                      Two-Factor Authentication
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
                    <div className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm md:text-base">
                          Authenticator App
                        </Label>
                        <p className="text-xs text-muted-foreground md:text-sm">
                          Use an authenticator app to generate verification
                          codes
                        </p>
                      </div>
                      <Switch
                        checked={user.twoFactorEnabled}
                        className="self-start sm:self-center"
                      />
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm md:text-base">
                          SMS Authentication
                        </Label>
                        <p className="text-xs text-muted-foreground md:text-sm">
                          Receive verification codes via SMS
                        </p>
                      </div>
                      <Switch className="self-start sm:self-center" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="space-y-1 p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl">
                      Active Sessions
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Manage your active login sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
                    {[
                      {
                        device: "Chrome on Windows",
                        location: "New York, USA",
                        active: true,
                      },
                      {
                        device: "Safari on iPhone",
                        location: "New York, USA",
                        active: false,
                      },
                    ].map((session, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-4 w-4 text-muted-foreground md:h-5 md:w-5" />
                          <div>
                            <p className="text-sm font-medium md:text-base">
                              {session.device}
                            </p>
                            <p className="text-xs text-muted-foreground md:text-sm">
                              {session.location}
                            </p>
                          </div>
                        </div>
                        {session.active ? (
                          <Badge variant="default" className="w-fit">
                            Current
                          </Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader className="space-y-1 p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl">
                      Email Notifications
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Choose what emails you'd like to receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
                    {[
                      {
                        title: "Security alerts",
                        description:
                          "Get notified about login attempts and security changes",
                      },
                      {
                        title: "Marketing emails",
                        description:
                          "Receive updates about new features and promotions",
                      },
                      {
                        title: "Newsletter",
                        description:
                          "Weekly digest of platform updates and tips",
                      },
                      {
                        title: "Product updates",
                        description: "Be the first to know about new features",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="space-y-0.5">
                          <Label className="text-sm md:text-base">
                            {item.title}
                          </Label>
                          <p className="text-xs text-muted-foreground md:text-sm">
                            {item.description}
                          </p>
                        </div>
                        <Switch
                          defaultChecked={index < 2}
                          className="self-start sm:self-center"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-6">
                <Card>
                  <CardHeader className="space-y-1 p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl">
                      Payment Methods
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      Manage your payment methods and billing information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
                    <div className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-muted-foreground md:h-8 md:w-8" />
                        <div>
                          <p className="text-sm font-medium md:text-base">
                            •••• •••• •••• 4242
                          </p>
                          <p className="text-xs text-muted-foreground md:text-sm">
                            Expires 12/25
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        Default
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="space-y-1 p-4 md:p-6">
                    <CardTitle className="text-lg md:text-xl">
                      Billing History
                    </CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                      View your past invoices and payments
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 p-4 pt-0 md:p-6 md:pt-0">
                    {[
                      { date: "Mar 1, 2024", amount: "$29.00", status: "Paid" },
                      { date: "Feb 1, 2024", amount: "$29.00", status: "Paid" },
                      { date: "Jan 1, 2024", amount: "$29.00", status: "Paid" },
                    ].map((invoice, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium md:text-base">
                            {invoice.date}
                          </p>
                          <p className="text-xs text-muted-foreground md:text-sm">
                            Premium Plan
                          </p>
                        </div>
                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                          <span className="text-sm md:text-base">
                            {invoice.amount}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {invoice.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
