import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState, useTransition } from "react";
import { Cell, Column, Row, Table, TableBody, TableHeader, } from "react-aria-components";
import { ErrorBoundary } from "react-error-boundary";

// Mock data type
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API function
async function fetchUsers(): Promise<User[]> {
  await delay(50);
  // Random number of users between 50-100
  const userCount = Math.floor(Math.random() * 51) + 50;
  console.log(userCount)
  const roles = ["Admin", "User", "Manager", "Guest"];
  const statuses = ["Active", "Inactive", "Pending"];
  const firstNames = ["John", "Jane", "Bob", "Alice", "Tom", "Emma", "Mike", "Sara", "David", "Lisa"];
  const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"];

  return Array.from({ length: userCount }, (_, i) => {
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomId = crypto.randomUUID();

    return {
      id: randomId,
      name: `${randomFirst} ${randomLast}`,
      email: `${randomFirst.toLowerCase()}.${randomLast.toLowerCase()}${randomId}@example.com`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
    };
  });
}

function TableWithModal() {
  const [refetchCount, setRefetchCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const { data, refetch } = useSuspenseQuery({
    queryKey: ["users", refetchCount],
    queryFn: fetchUsers,
  });

  const handleRefetch = () => {
    startTransition(() => {
      setRefetchCount((prev) => prev + 1);
    })
    startTransition(async () => {
      await refetch();
    });
  };

  return (
    <div className="table-container">
      <div className="controls">
        <button onClick={handleRefetch} data-testid={"refetch-button"}>Refetch Data</button>
      </div>

      <Table aria-label="Users table" style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        <TableHeader>
          <Column isRowHeader>Name</Column>
          <Column>Email</Column>
          <Column>Role</Column>
          <Column>Status</Column>
        </TableHeader>
        <TableBody items={data}>
          {(user) => (
            <Row key={user.id} id={user.id}>
              <Cell>{user.name}</Cell>
              <Cell>{user.email}</Cell>
              <Cell>{user.role}</Cell>
              <Cell>{user.status}</Cell>
            </Row>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function ErrorFallback({
                         error,
                         resetErrorBoundary,
                       }: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="error" data-testid="error-fallback">
      <h3>An error occurred:</h3>
      <pre>{error.message}</pre>
      {error.stack && <pre>{error.stack}</pre>}
      <button onClick={resetErrorBoundary} style={{ marginTop: "10px" }}>
        Reset
      </button>
    </div>
  );
}

function App() {
  return (
    <div className="container">
      <div className="header">
        <h1 className="title">React Aria Table DOM Exception Reproduction</h1>
        <p className="description">
          This app reproduces the "Attempted to access node before it was
          defined" error that occurs when using React Aria Table with Modal and
          useSuspenseQuery.
        </p>
        <p className="description">
          The error occurs when closing a modal and immediately refetching table
          data, causing a race condition in React Aria's internal DOM
          management.
        </p>
      </div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <TableWithModal/>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
