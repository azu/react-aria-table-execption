import { useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableHeader,
  Column,
  Row,
  Cell,
} from "react-aria-components";
import { ErrorBoundary } from "react-error-boundary";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

const firstNames = ["John", "Jane", "Bob", "Alice", "Tom", "Emma", "Mike", "Sara", "David", "Lisa"];
const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"];
const roles = ["Admin", "User", "Manager", "Guest"];
const statuses = ["Active", "Inactive", "Pending"];

function generateRandomData(count: number): User[] {
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomId = crypto.randomUUID();

    users.push({
      id: randomId,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomId}@example.com`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }

  return users;
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
  const [data, setData] = useState<User[]>(() => generateRandomData(150));
  const [isPending, startTransition] = useTransition();

  const handleRefetch = () => {
    startTransition(() => {
      const count = Math.floor(Math.random() * 51) + 150; // 150-200 items
      setData(generateRandomData(count));
    });
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">React Aria Table DOM Exception Reproduction</h1>
        <p className="description">
          This app reproduces the "Attempted to access node before it was
          defined" error that occurs when using React Aria Table with dynamic collections.
        </p>
      </div>

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="table-container">
          <div className="controls">
            <button
              onClick={handleRefetch}
              data-testid="refetch-button"
              // disabled={isPending}
            >
              {isPending ? "Refetching..." : "Refetch Data"}
            </button>
          </div>

          <Table
            aria-label="Users table"
            style={{ opacity: isPending ? 0.5 : 1, transition: 'opacity 0.2s' }}
          >
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
      </ErrorBoundary>
    </div>
  );
}

export default App;
