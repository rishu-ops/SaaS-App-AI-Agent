import CompanionForm from "@/components/CompanionForm";

const NewCompanion = () => {
  return (
    <main className="max-lg-1/3 max-w-2/3 items-center justify-center py-4">
      <article className="w-full gap-4 flex flex-col">
        <h1>Companian Builder</h1>

        <CompanionForm />
      </article>
    </main>
  );
};

export default NewCompanion;
