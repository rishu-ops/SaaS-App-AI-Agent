import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, getSubjectColor } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface CompanionsListProps {
  title: string;
  companions: Companion[];
  className?: string;
}

const CompanionList = ({
  title,
  companions,
  className,
}: CompanionsListProps) => {
  return (
    <article className={cn("companion-list", className)}>
      <h2 className="font-bold text-3xl">Recent Sessions</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg w-2/3">Lessons</TableHead>
            <TableHead className="text-lg">Subject</TableHead>
            <TableHead className="text-lg text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companions?.map(({ id, subject, name, duration, topic }) => (
            <TableRow key={id}>
              <TableCell>
                <Link href={`/companions/${id}`}>
                  <div className="flex items-center gap-2">
                    <div
                      className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
                      style={{ backgroundColor: getSubjectColor(subject) }}
                    >
                      <Image
                        src={`/icons/${subject}.svg`}
                        width={35}
                        height={35}
                        alt={`${subject} logo`}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="font-bold text-2xl">{name}</p>
                      <p className="text-lg">{topic}</p>
                    </div>
                  </div>
                </Link>
              </TableCell>
              <TableCell>
                <div
                  className="subject-badge w-fit max-md:hidden"
                  style={{ backgroundColor: getSubjectColor(subject) }}
                >
                  {subject}
                </div>

                <div
                  className="flex items-center justify-center rounded-lg w-fit p-2 md:hidden"
                  style={{ backgroundColor: getSubjectColor(subject) }}
                >
                  <Image
                    src={`/icons/${subject}.svg`}
                    width={18}
                    height={18}
                    alt="subject"
                  />
                </div>
              </TableCell>

              <TableCell className="flex items-center gap-2 w-full">
                <p className="text-2xl">
                  {duration} <span className="max-md:hidden">mins</span>
                  <Image
                    src={"/icons/clock.svg"}
                    alt="minutes"
                    width={14}
                    height={14}
                    className="max-md:hidden"
                  />
                </p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </article>
  );
};

export default CompanionList;
