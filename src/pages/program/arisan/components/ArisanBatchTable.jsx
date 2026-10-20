import React, { useState, useMemo } from "react";
import { Table, Button, Spinner, Card } from "react-bootstrap";
import { Users } from "phosphor-react";
import ArisanBatchFilterHeader from "./table/ArisanBatchFilterHeader";
import ArisanBatchRow, { monthNames } from "./table/ArisanBatchRow";
import ArisanBatchPagination from "./table/ArisanBatchPagination";

const initialFilterState = {
  periode: "",
  kategori: "",
  nama: "",
  peserta: "",
  term: "",
  setoran: "",
  keberangkatan: "",
  total: "",
  status: "",
};

const ArisanBatchTable = ({
  batches = [],
  loading = false,
  onAddNew,
  onViewParticipant,
  onViewDraw,
  onEdit,
  onDelete,
}) => {
  const [filter, setFilter] = useState(initialFilterState);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleFilterChange = (field, val) => {
    setFilter((prev) => ({ ...prev, [field]: val }));
    setCurrentPage(1);
  };

  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const periodStr = `${
        b.period_start_month ? monthNames[b.period_start_month - 1] : ""
      } ${b.period_start_year}`.toLowerCase();
      const catStr = (b.category || "Arisan").toLowerCase();
      const nameStr = `${b.program_name} ${b.batch_name}`.toLowerCase();
      const participantStr = `${b.participant_count || 0}/${
        b.participants_quota
      }`.toLowerCase();
      const termStr = String(b.cooperation_months).toLowerCase();
      const setoranStr = String(b.monthly_installment).toLowerCase();
      const berangkatStr = String(b.jumlah_keberangkatan || "-").toLowerCase();
      const totalStr = String(b.target_amount).toLowerCase();
      const statusStr = (b.status || "").toLowerCase();

      return (
        periodStr.includes(filter.periode.toLowerCase()) &&
        catStr.includes(filter.kategori.toLowerCase()) &&
        nameStr.includes(filter.nama.toLowerCase()) &&
        participantStr.includes(filter.peserta.toLowerCase()) &&
        termStr.includes(filter.term.toLowerCase()) &&
        setoranStr.includes(filter.setoran.toLowerCase()) &&
        berangkatStr.includes(filter.keberangkatan.toLowerCase()) &&
        totalStr.includes(filter.total.toLowerCase()) &&
        statusStr.includes(filter.status.toLowerCase())
      );
    });
  }, [batches, filter]);

  const totalPages = Math.ceil(filteredBatches.length / pageSize);
  const pagedBatches = useMemo(() => {
    return filteredBatches.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredBatches, currentPage]);

  return (
    <Card className="border-0 shadow-sm rounded-4">
      <Card.Body className="p-0">
        <Table
          hover
          responsive
          borderless
          className="align-middle mb-0 custom-table-admin"
          style={{ whiteSpace: "nowrap" }}
        >
          <thead className="table-light">
            <ArisanBatchFilterHeader
              filter={filter}
              onFilterChange={handleFilterChange}
            />
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                </td>
              </tr>
            ) : filteredBatches.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-5">
                  <div className="text-muted mb-3">
                    <Users size={48} className="text-light mb-2 opacity-50" />
                    <br />
                    Data tidak ditemukan atau belum ada batch arisan.
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onAddNew}
                    className="px-4 rounded-pill"
                  >
                    Buat Batch Baru
                  </Button>
                </td>
              </tr>
            ) : (
              pagedBatches.map((b) => (
                <ArisanBatchRow
                  key={b.arisan_batch_id}
                  batch={b}
                  onViewParticipant={onViewParticipant}
                  onViewDraw={onViewDraw}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </Table>
      </Card.Body>

      <ArisanBatchPagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={filteredBatches.length}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Card>
  );
};

export default ArisanBatchTable;
