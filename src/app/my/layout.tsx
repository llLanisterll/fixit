import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CustomerLayoutClient from "./CustomerLayoutClient";

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return <CustomerLayoutClient>{children}</CustomerLayoutClient>;
}
