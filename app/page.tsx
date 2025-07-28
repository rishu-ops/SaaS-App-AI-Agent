import CompanionCard from "@/components/CompanionCard";
import CompanionList from "@/components/CompanionList";
import CTA from "@/components/CTA";
import { recentSessions } from "@/constants";
import React from "react";

const Page = () => {
  return (
    <main>
      <h1 className="text-3xl underline"> Popular Companions</h1>

      <section className="home-section">
        <CompanionCard
          id="1"
          name="Companion One"
          topic="Adventure"
          subject="Exploration"
          duration={34}
          color="#f0f0f0"
        />
        <CompanionCard
          id="1"
          name="Companion One"
          topic="Science"
          subject="Exploration"
          duration={44}
          color="#e5d0ff"
        />
        <CompanionCard
          id="3"
          name="Countsy the Count"
          topic="Racing"
          subject="Exploration"
          duration={30}
          color="#ffda6e"
        />
      </section>

      <section className="home-section">
        <CompanionList
          title="Recent Invoices"
          companions={recentSessions}
          className="w-2/3 max-lg:w-full"
        />
        <CTA />
      </section>
    </main>
  );
};

export default Page;
