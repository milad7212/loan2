"use client";

import { ReferrersProvider } from "./context/ReferrersContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ReferrersProvider>{children}</ReferrersProvider>;
}
