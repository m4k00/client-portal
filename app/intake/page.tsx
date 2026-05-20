import { IntakeForm } from "./_components/intake-form";

export default function IntakePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Let's Build Something Amazing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us about your project and get an AI-powered scope assessment in minutes
          </p>
        </div>
        <IntakeForm />
      </div>
    </div>
  );
}
