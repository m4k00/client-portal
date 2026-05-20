import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { TRPCProvider } from "@/lib/trpc-client";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <TRPCProvider>
      <div className="flex h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </TRPCProvider>
  );
}
