"use client";

import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectValue } from "./ui/select";
import { SelectItem, SelectTrigger } from "@radix-ui/react-select";
import { subjects } from "@/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";

const SubjectFilter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSubject = searchParams.get("subject") || "all";

  const [subject, setSubject] = useState(currentSubject);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let newUrl = "";

      if (subject === "all") {
        newUrl = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ["subject"],
        });
      } else {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "subject",
          value: subject,
        });
      }

      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(timeout);
  }, [subject]);

  return (
    <Select onValueChange={setSubject} value={subject}>
      <SelectTrigger className="input border rounded  text-black capitalize">
        <SelectValue placeholder="Select the subject" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Subjects</SelectItem>
        {subjects.map((subject) => (
          <SelectItem key={subject} value={subject} className="capitalize">
            {subject}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubjectFilter;
