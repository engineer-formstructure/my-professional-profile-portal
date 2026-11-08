import { describe, expect, it } from "vitest";
import { classProgress, dimensionScore, formatTenure, tenureMonths } from "./profile";

describe("profile rules", () => {
  it("formats tenure in years and months", () => {
    expect(formatTenure(tenureMonths(new Date(2023, 6, 1), new Date(2026, 10, 8)))).toBe("3 Years, 4 Months");
  });
  it("excludes N/A criteria from weighted score", () => {
    expect(dimensionScore([
      { id: "a", name: "", score: 4, weight: 3, assessor: "", evidence: "" },
      { id: "b", name: "", score: null, weight: 5, assessor: "", evidence: "" },
      { id: "c", name: "", score: 2, weight: 1, assessor: "", evidence: "" },
    ])).toBe(3.5);
  });
  it("Level IV has no next class", () => {
    const p = classProgress(12 * 12);
    expect(p.current.id).toBe("ultimate");
    expect(p.next).toBeNull();
  });
});
