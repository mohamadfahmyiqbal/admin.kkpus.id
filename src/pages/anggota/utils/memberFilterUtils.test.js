import { describe, it, expect } from "vitest";
import {
  MEMBER_FILTER_KEYS,
  createEmptyMemberFilters,
  isSameFilterState,
} from "./memberFilterUtils";

describe("memberFilterUtils", () => {
  it("membuat semua filter kosong", () => {
    const filters = createEmptyMemberFilters();

    expect(Object.keys(filters)).toEqual(MEMBER_FILTER_KEYS);
    expect(Object.values(filters).every((v) => v === "")).toBe(true);
  });

  it("menganggap dua state kosong sama", () => {
    expect(isSameFilterState(createEmptyMemberFilters(), createEmptyMemberFilters())).toBe(true);
  });

  it("mendeteksi nilai yang berbeda (mis. suntikan autofill)", () => {
    const before = createEmptyMemberFilters();
    const after = { ...before, nameOrContact: "bendahara" };

    expect(isSameFilterState(before, after)).toBe(false);
  });

  it("menganggap undefined/null sama dengan filter kosong", () => {
    expect(isSameFilterState(undefined, null)).toBe(true);
    expect(isSameFilterState({ role: "bendahara" }, { role: "bendahara" })).toBe(true);
    expect(isSameFilterState({ role: "bendahara" }, {})).toBe(false);
  });
});