import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useProgress, ProgressCtx } from "../hooks/useProgress";
import type { ProgressState } from "../lib/storage";

describe("useProgress", () => {
  it("throws error when used outside of Provider", () => {
    // Suppress console.error for this expected error
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    expect(() => renderHook(() => useProgress())).toThrow("useProgress must be used within ProgressProvider");
    
    consoleSpy.mockRestore();
  });

  it("returns context when used within Provider", () => {
    const mockState: ProgressState = {
      name: "Test User",
      email: "test@example.com",
      lang: "en",
      guidedTouch: true,
      modules: {
        1: { progress: 0, completed: false, steps: [] },
        2: { progress: 0, completed: false, steps: [] },
        3: { progress: 0, completed: false, steps: [] },
        4: { progress: 0, completed: false, steps: [] },
      },
      chat: {}
    };

    const mockCtx = {
      state: mockState,
      setName: vi.fn(),
      setEmail: vi.fn(),
      setLang: vi.fn(),
      setGuidedTouch: vi.fn(),
      updateStep: vi.fn(),
      updateModule: vi.fn(),
      pushChat: vi.fn(),
      overall: 50,
      reset: vi.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ProgressCtx.Provider value={mockCtx}>
        {children}
      </ProgressCtx.Provider>
    );

    const { result } = renderHook(() => useProgress(), { wrapper });
    
    expect(result.current.state.name).toBe("Test User");
    expect(result.current.overall).toBe(50);
  });
});
