import { describe, it, expect } from "vitest";
import { cn } from "../lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      expect(cn("p-4", "m-4")).toBe("p-4 m-4");
      expect(cn("p-4", { "m-4": true, "bg-red": false })).toBe("p-4 m-4");
    });
    
    it("handles tailwind class conflicts", () => {
      expect(cn("px-2 py-1 bg-red-500", "p-3 bg-blue-500")).toBe("p-3 bg-blue-500");
    });
  });
});
