import Image from "next/image";
import Link from "next/link";
import React from "react";

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="cta-badge"> start Leaning your way.</div>
      <h2 className="text-3xl font-bold">
        {" "}
        Build and Personalize learning journeys{" "}
      </h2>
      <p>
        Pick a name, topic, and level to get started , then choose a companion
      </p>
      <Image src={"/images/cta.svg"} alt="cta" width={362} height={232} />
      <button className="btn-primary">
        <Image src={"/icons/plus.svg"} alt="plus" width={12} height={12} />
        <Link href="/companions/new">
          <p>Build a New Companion</p>
        </Link>
      </button>
    </section>
  );
};

export default CTA;
