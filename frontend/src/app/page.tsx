import LoginForm from "@/components/LoginForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">ClassCare</h1>
      <p className="text-muted-foreground mb-8">Login to continue</p>
      <LoginForm />
    </div>
  );
}





