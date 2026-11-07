import React, { useRef, useEffect } from "react";
import { Tab, Nav } from "react-bootstrap";
import { ArrowDownLeft, ArrowUpRight } from "phosphor-react";

const SimpananTabsHeader = ({
  activeType,
  onTypeSelect,
  activeSukarelaCategory,
  onSukarelaCategoryChange,
  totalRecords = 0,
}) => {
  const tabsWrapperRef = useRef(null);

  // Enable smooth horizontal scrolling on mouse wheel
  useEffect(() => {
    const el = tabsWrapperRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      if (e.deltaY !== 0 && el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const isMemberAggregates = activeType === "POKOK" || activeType === "WAJIB";

  return (
    <div className="px-3 px-md-4 pt-3 pb-2 border-bottom bg-white">
      <Tab.Container activeKey={activeType} onSelect={onTypeSelect}>
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch align-items-lg-center gap-3">
          <div
            ref={tabsWrapperRef}
            className="tabs-scrollable-container mb-0 flex-grow-1"
            style={{
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              maxWidth: "100%",
              minWidth: 0,
            }}
          >
            <Nav
              variant="pills"
              className="global-tabs border-0 flex-nowrap"
              style={{
                display: "inline-flex",
                width: "max-content",
                minWidth: "max-content",
              }}
            >
              <Nav.Item>
                <Nav.Link eventKey="POKOK">Simpanan Pokok</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="WAJIB">Simpanan Wajib</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="SUKARELA">Simpanan Sukarela</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          {/* Sub-tabs for Sukarela (Setoran vs Pencairan) & Total Badge */}
          <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-end gap-2 gap-md-3 flex-shrink-0">
            {activeType === "SUKARELA" && (
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted extra-small fw-bold text-uppercase">Kategori:</span>
                <div className="d-flex align-items-center gap-1 p-1 bg-light rounded-pill border">
                  <button
                    type="button"
                    className={`btn btn-sm py-1 px-3 rounded-pill border-0 shadow-none d-flex align-items-center gap-1 extra-small fw-bold ${
                      activeSukarelaCategory === "SETORAN"
                        ? "bg-white text-primary shadow-sm"
                        : "text-muted"
                    }`}
                    onClick={() => onSukarelaCategoryChange("SETORAN")}
                  >
                    <ArrowDownLeft size={13} className="text-success" weight="bold" />
                    Setoran
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm py-1 px-3 rounded-pill border-0 shadow-none d-flex align-items-center gap-1 extra-small fw-bold ${
                      activeSukarelaCategory === "PENCAIRAN"
                        ? "bg-white text-primary shadow-sm"
                        : "text-muted"
                    }`}
                    onClick={() => onSukarelaCategoryChange("PENCAIRAN")}
                  >
                    <ArrowUpRight size={13} className="text-danger" weight="bold" />
                    Pencairan
                  </button>
                </div>
              </div>
            )}
            <span className="badge bg-light text-dark border px-3 py-1.5 rounded-pill fw-semibold ms-auto ms-lg-0">
              Total: {totalRecords} {isMemberAggregates ? "Anggota" : "Transaksi"}
            </span>
          </div>
        </div>
      </Tab.Container>
    </div>
  );
};

export default SimpananTabsHeader;
