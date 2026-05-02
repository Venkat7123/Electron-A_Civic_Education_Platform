import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { onAuthStateChanged } from "firebase/auth";

vi.mock("firebase/auth", () => {
  return {
    getAuth: vi.fn(),
    onAuthStateChanged: vi.fn(),
  };
});

vi.mock("../gcp/firebase", () => ({
  auth: {},
}));

describe("ProtectedRoute", () => {
  it("renders loader initially", () => {
    // Mock loading state
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (onAuthStateChanged as any).mockImplementation((auth: any, callback: any) => {
      // Don't call callback immediately to simulate loading
      return vi.fn(); 
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );

    // Should find the loader SVG or similar loading indicator (which is a lucide icon in this case)
    // The Loader2 has class animate-spin
    expect(document.querySelector(".animate-spin")).not.toBeNull();
  });

  it("redirects to login if user is not authenticated", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (onAuthStateChanged as any).mockImplementation((auth: any, callback: any) => {
      callback(null); // No user
      return vi.fn();
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>} />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).not.toBeNull();
  });

  it("renders children if user is authenticated", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (onAuthStateChanged as any).mockImplementation((auth: any, callback: any) => {
      callback({ uid: "123", email: "test@test.com" }); // Mock user
      return vi.fn();
    });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute><div>Protected Content</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content")).not.toBeNull();
  });
});
