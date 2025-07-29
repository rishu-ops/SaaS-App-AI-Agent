"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";

const SearchInput = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get("topic") || "";

  const [searchQuery, setSearchQuery] = useState(currentQuery);

  // Debounce URL update on search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "topic",
          value: searchQuery.trim(),
        });
        router.push(newUrl, { scroll: false });
      } else {
        // Clear the topic from the URL if the search is empty
        const newUrl = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ["topic"],
        });
        router.push(newUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <div className="relative border border-black rounded-lg flex items-center gap-2 px-2 py-1 h-fit">
      <Image src="/icons/search.svg" width={15} height={15} alt="search" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search companions..."
        className="outline-none bg-transparent w-full"
      />
    </div>
  );
};

export default SearchInput;
