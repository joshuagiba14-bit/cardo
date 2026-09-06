import { redirect } from "next/navigation";
import type { AuthUserDTO } from "@cardo/shared";
import { apiFetchServer } from "@/lib/api-server";
import { LogoutButton } from "@/components/admin/logout-button";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const res = await apiFetchServer<AuthUserDTO>("/api/auth/me");

  if (!res.ok) {
    redirect("/admin/login");
  }

  const user = res.data;

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-h3 font-bold">Cardo Admin</p>
            <p className="text-small text-muted-foreground">
              {user.email} · {user.role}
            </p>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
