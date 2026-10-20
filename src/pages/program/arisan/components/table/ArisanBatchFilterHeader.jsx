import React from "react";

const ArisanBatchFilterHeader = ({ filter, onFilterChange }) => {
  return (
    <>
      <tr className="table-light">
        <th
          className="px-4 py-3 font-medium text-muted small text-center"
          style={{
            position: "sticky",
            left: 0,
            zIndex: 2,
            backgroundColor: "#f8f9fa",
            borderRight: "1px solid #e2e8f0",
            width: "160px",
          }}
        >
          Aksi
        </th>
        <th className="px-4 py-3 font-medium text-muted small text-center">
          Periode
        </th>
        <th className="px-4 py-3 font-medium text-muted small text-center">
          Kategori
        </th>
        <th className="px-4 py-3 font-medium text-muted small">
          Nama Arisan
        </th>
        <th className="px-4 py-3 font-medium text-muted small text-center">
          Peserta
        </th>
        <th className="px-4 py-3 font-medium text-muted small text-center">
          Term
        </th>
        <th className="px-4 py-3 font-medium text-muted small text-end">
          Setoran Bulanan
        </th>
        <th className="px-4 py-3 font-medium text-muted small text-center">
          Keberangkatan
        </th>
        <th className="px-4 py-3 font-medium text-muted small text-end">
          Total Biaya
        </th>
        <th className="px-4 py-3 font-medium text-muted small text-center">
          Status
        </th>
      </tr>
      <tr className="bg-light border-bottom">
        <th
          className="px-2 py-2"
          style={{
            position: "sticky",
            left: 0,
            zIndex: 2,
            backgroundColor: "#f8f9fa",
            borderRight: "1px solid #e2e8f0",
          }}
        />
        <th className="px-2 py-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Cari..."
            value={filter.periode}
            onChange={(e) => onFilterChange("periode", e.target.value)}
          />
        </th>
        <th className="px-2 py-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Cari..."
            value={filter.kategori}
            onChange={(e) => onFilterChange("kategori", e.target.value)}
          />
        </th>
        <th className="px-2 py-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Cari..."
            value={filter.nama}
            onChange={(e) => onFilterChange("nama", e.target.value)}
          />
        </th>
        <th className="px-2 py-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Cari..."
            value={filter.peserta}
            onChange={(e) => onFilterChange("peserta", e.target.value)}
          />
        </th>
        <th className="px-2 py-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Cari..."
            value={filter.term}
            onChange={(e) => onFilterChange("term", e.target.value)}
          />
        </th>
        <th className="px-2 py-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Cari..."
            value={filter.setoran}
            onChange={(e) => onFilterChange("setoran", e.target.value)}
          />
        </th>
        <th className="px-2 py-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Cari..."
            value={filter.keberangkatan}
            onChange={(e) => onFilterChange("keberangkatan", e.target.value)}
          />
        </th>
        <th className="px-2 py-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Cari..."
            value={filter.total}
            onChange={(e) => onFilterChange("total", e.target.value)}
          />
        </th>
        <th className="px-2 py-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Cari..."
            value={filter.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
          />
        </th>
      </tr>
    </>
  );
};

export default ArisanBatchFilterHeader;
