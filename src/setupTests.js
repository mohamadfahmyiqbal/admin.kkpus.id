// jest-dom custom matchers
import "@testing-library/jest-dom";

// MSW server untuk mock API saat test frontend
import { server } from "./mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
