"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";
import { LayoutDashboard, LogOut } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-muted/10">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Client Portal</h1>
        <p className="text-sm text-muted-foreground">Admin Dashboard</p>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
