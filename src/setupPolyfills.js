// Polyfill Web Streams API untuk environment jsdom
// File ini HARUS di-import sebelum modul lain yang membutuhkan WritableStream (seperti msw)
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