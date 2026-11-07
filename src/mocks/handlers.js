import { http, HttpResponse } from "msw";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

export const handlers = [
  // Auth login
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = await request.json();
    if (
      body.email === "admin@kkpus.id" &&
      body.password === "password"
    ) {
      return HttpResponse.json({
        token: "mock-admin-jwt-token",
        user: {
          id: 1,
          email: "admin@kkpus.id",
          name: "Admin Test",
          role: "admin",
        },
      });
    }
    return HttpResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }),

  // Ambil profil user
  http.get(`${API_BASE}/auth/me`, () => {
    return HttpResponse.json({
      user: {
        id: 1,
        email: "admin@kkpus.id",
        name: "Admin Test",
        role: "admin",
      },
    });
  }),

  // Buat transaksi
  http.post(`${API_BASE}/transaksi`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      {
        id: 9001,
        ...body,
        status: "pending",
        created_at: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  // Detail transaksi
  http.get(`${API_BASE}/transaksi/:id`, ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      amount: 500000,
      type: "simpanan",
      status: "pending",
    });
  }),

  // Fallback semua endpoint lainnya
  http.all("*", () => new HttpResponse(null, { status: 404 })),
];
