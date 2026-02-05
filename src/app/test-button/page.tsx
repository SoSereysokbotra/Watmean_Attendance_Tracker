import { Button } from "@/components/ui/button";

export default function TestButtonPage() {
  return (
    <div className="p-10 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-4">Original Buttons</h2>
        <div className="flex gap-4 items-center">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">
          New Teacher Dashboard Buttons
        </h2>
        <div className="flex gap-4 items-center">
          <Button variant="primary" size="md">
            Primary (MD)
          </Button>
          <Button variant="primary" size="lg">
            Primary (LG)
          </Button>
          <Button variant="primary" size="sm">
            Primary (SM)
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Mixed Usage</h2>
        <div className="flex gap-4 items-center">
          <Button variant="primary" size="default">
            Primary (Default Size)
          </Button>
          <Button variant="default" size="md">
            Default (MD Size)
          </Button>
        </div>
      </div>
    </div>
  );
}
