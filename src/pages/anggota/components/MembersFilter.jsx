import React from "react";
import { Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { MagnifyingGlass, X, Funnel } from "phosphor-react";

const MembersFilter = ({ search, setSearch, onReset }) => {
  const hasActiveFilters = Boolean(
    search.query || search.type || search.status
  );

  return (
    <div className="mb-4">
      <Row className="g-2 g-md-3 align-items-center">
        <Col md={6} lg={5}>
          <InputGroup>
            <InputGroup.Text className="bg-white border-end-0 text-muted">
              <MagnifyingGlass size={18} />
            </InputGroup.Text>
            <Form.Control
              className="border-start-0 ps-0"
              placeholder="Cari No. Anggota, Nama, NIK, atau Email..."
              value={search.query}
              onChange={(e) => setSearch((prev) => ({ ...prev, query: e.target.value }))}
            />
            {search.query && (
              <Button
                variant="outline-secondary"
                className="border-start-0 border-light"
                onClick={() => setSearch((prev) => ({ ...prev, query: "" }))}
                title="Hapus pencarian"
              >
                <X size={16} />
              </Button>
            )}
          </InputGroup>
        </Col>

        <Col sm={6} md={3} lg={3}>
          <Form.Select
            value={search.type}
            onChange={(e) => setSearch((prev) => ({ ...prev, type: e.target.value }))}
          >
            <option value="">Semua Tipe Anggota</option>
            <option value="reguler">Reguler</option>
            <option value="luar biasa">Luar Biasa</option>
          </Form.Select>
        </Col>

        <Col sm={6} md={3} lg={3}>
          <Form.Select
            value={search.status}
            onChange={(e) => setSearch((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="nonaktif">Nonaktif</option>
          </Form.Select>
        </Col>

        {hasActiveFilters && (
          <Col xs="auto" className="d-flex align-items-center">
            <Button
              variant="link"
              className="text-muted p-0 text-decoration-none small d-flex align-items-center gap-1"
              onClick={onReset}
            >
              <X size={14} /> Reset Filter
            </Button>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default React.memo(MembersFilter);
