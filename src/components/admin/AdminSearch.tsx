"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Suspense } from "react";

function SearchInputContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className="relative hidden sm:block">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        size={16}
      />
      <input
        type="text"
        placeholder="Search..."
        defaultValue={searchParams.get("search") || ""}
        onChange={(e) => {
          const params = new URLSearchParams(window.location.search);
          if (e.target.value) {
            params.set("search", e.target.value);
          } else {
            params.delete("search");
          }
          router.replace(`?${params.toString()}`);
        }}
        className="pl-9 pr-4 py-2 bg-muted border-none rounded-full text-sm focus:ring-2 focus:ring-brand-primary/20 focus:bg-card outline-none w-64 transition-colors"
      />
    </div>
  );
}

export default function AdminSearch() {
  return (
    <Suspense fallback={<div className="w-64 h-10" />}>
      <SearchInputContent />
    </Suspense>
  );
}
