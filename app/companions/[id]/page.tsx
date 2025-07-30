import CompanionComponent from "@/components/CompanionComponent";
import { getCompanionById } from "@/lib/actions/companion.action";
import { getSubjectColor } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

interface CompanionSessionProps {
  params: Promise<{ id: string }>;
}

// params /url/{id} => id
// searchParms /url?key=value&key1=value1

const CompanionSession = async ({ params }: CompanionSessionProps) => {
  const { id } = await params;
  const companion = await getCompanionById(id);
  const user = await auth();
  const { name, subject, title, duration, topic } = companion;

  if (!user) {
    redirect("/sign-in");
  }

  if (!id || !companion) {
    redirect("/companions");
  }

  return (
    <main>
      <article className="flex rounded-border justify-between p-6 max-md:flex-col">
        <div className="flex items-center gap-2">
          <div
            className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
            style={{ backgroundColor: getSubjectColor(subject) }}
          >
            <Image
              src={`/icons/${subject}.svg`}
              width={35}
              height={35}
              alt={subject}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="font-bold text-2xl">{name}</p>
              <div className="subject-badge max-sm:hidden">{subject}</div>
            </div>

            <p className="text-lg">{topic || "No topic specified"}</p>
          </div>
        </div>

        <div className="items-start text-2xl max-md:hidden">
          {duration} minutes
        </div>
      </article>

      <CompanionComponent
        {...companion}
        companionId={id}
        userName={user.firstName!}
        userImage={user.imageUrl!}
      />
    </main>
  );
};

export default CompanionSession;
