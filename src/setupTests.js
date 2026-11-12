// Polyfill Web Streams API untuk environment jsdom
import { TransformStream, WritableStream, ReadableStream } from "node:stream/web";

if (!globalThis.WritableStream) {
  globalThis.WritableStream = WritableStream;
}
if (!globalThis.TransformStream) {
  globalThis.TransformStream = TransformStream;
}
if (!globalThis.ReadableStream) {
  globalThis.ReadableStream = ReadableStream;
}

// jest-dom custom matchers
import "@testing-library/jest-dom";

// MSW server untuk mock API saat test frontend
import { server } from "./mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
