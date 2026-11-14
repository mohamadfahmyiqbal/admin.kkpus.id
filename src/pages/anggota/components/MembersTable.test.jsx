import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import MembersTable from "./MembersTable";
import { createEmptyMemberFilters } from "../utils/memberFilterUtils";

const renderTable = (overrides = {}) =>
  render(
    <MembersTable
      loading={false}
      members={[]}
      formatDate={(d) => d}
      filters={createEmptyMemberFilters()}
      onFilterChange={() => {}}
      onResetFilters={() => {}}
      selectedMemberIds={[]}
      {...overrides}
    />
  );

const FILTER_CONTROLS = 'thead input[name^="memberFilter"], thead select[name^="memberFilter"]';

describe("MembersTable filter kolom", () => {
  it("mematikan autofill pada semua kontrol filter", () => {
    const { container } = renderTable();
    const controls = Array.from(container.querySelectorAll(FILTER_CONTROLS));

    expect(controls).toHaveLength(6);
    controls.forEach((control) => {
      expect(control.getAttribute("autocomplete")).toBe("off");
      expect(control.getAttribute("name")).toBeTruthy();
    });
  });

  it("menolak autofill password manager pada kolom pencarian", () => {
    const { container } = renderTable();

    container
      .querySelectorAll('thead input[name^="memberFilter"]')
      .forEach((input) => {
        expect(input.getAttribute("data-1p-ignore")).toBe("true");
        expect(input.getAttribute("data-lpignore")).toBe("true");
      });
  });

  it("tetap meneruskan ketikan pengguna ke handler filter", () => {
    const changes = [];
    const { container } = renderTable({
      onFilterChange: (field, value) => changes.push([field, value]),
    });

    const nameInput = container.querySelector(
      'input[name="memberFilterNameOrContact"]'
    );
    fireEvent.change(nameInput, { target: { value: "budi" } });

    expect(changes).toContainEqual(["nameOrContact", "budi"]);
  });
});