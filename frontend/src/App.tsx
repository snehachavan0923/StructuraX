import { useQuery } from "@tanstack/react-query";
import { fetchHealth } from "./lib/api";

export default function App() {
  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    retry: false,
  });

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-8">
      <h1 className="text-xl font-semibold">Temporary API health check</h1>
      {healthQuery.isPending && <p>Checking the live backend…</p>}
      {healthQuery.isError && (
        <p role="alert">Backend request failed: {healthQuery.error.message}</p>
      )}
      {healthQuery.data && (
        <pre
          className="overflow-auto rounded border p-4 text-sm"
          data-testid="health-response"
        >
          {JSON.stringify(healthQuery.data, null, 2)}
        </pre>
      )}
    </main>
  );
}
