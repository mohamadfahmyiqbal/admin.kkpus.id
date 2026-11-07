import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

// Mock modul virtual PWA agar tidak error saat dijalankan di vitest
vi.mock("virtual:pwa-register/react", () => ({
  useRegisterSW: () => ({ needRefresh: [false, () => {}], updateServiceWorker: () => {} }),
}));

import App from "./App.jsx";

describe("App smoke test", () => {
  it("merender App tanpa crash", () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});