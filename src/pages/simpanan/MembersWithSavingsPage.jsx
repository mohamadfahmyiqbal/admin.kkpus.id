import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, Breadcrumb, Button, Spinner, Modal, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import savingsService from "../../utils/api/USavings";
import { formatRupiah, jwtEncode } from "../../utils/helpers";
import { Eye } from "phosphor-react";

const MembersWithSavingsPage = () => {
  const navigate = useNavigate();
  const [membersWithSavings, setMembersWithSavings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [memberTransactions, setMemberTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const fetchMembersWithSavings = async () => {
    setLoading(true);
    try {
      const reportRes = await savingsService.getAdminSavingsReport();
      if (reportRes.data?.status) {
        const reportData = reportRes.data.data.list || [];
        
        const membersWithSavingsData = reportData.filter(member => {
          const currentTotal = member.tahun_ini?.total || 0;
          const previousTotal = member.tahun_lalu?.total || 0;
          const twoYearsAgoTotal = member.tahun_lalu2?.total || 0;
          
          return currentTotal > 0 || previousTotal > 0 || twoYearsAgoTotal > 0;
        });
        
        setMembersWithSavings(membersWithSavingsData);
      }
    } catch (err) {
      console.error("Error fetching members with savings:", err);
      Swal.fire({
        icon: "error",
        title: "Kesalahan Sistem",
        text: err.response?.data?.message || err.message || "Gagal memuat data anggota dengan simpanan.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembersWithSavings();
  }, []);

  const filteredMembers = useMemo(() => {
    if (!searchTerm) return membersWithSavings;
    
    const searchLower = searchTerm.toLowerCase();
    return membersWithSavings.filter(member =>
      member.nama.toLowerCase().includes(searchLower)
    );
  }, [membersWithSavings, searchTerm]);

  const handleViewTransactions = async (member) => {
    setSelectedMember(member);
    setShowTransactionModal(true);
    setTransactionsLoading(true);
    
    try {
      const transactionsRes = await savingsService.getSavingsHistory({
        member_id: member.member_id || member.id,
        limit: 100,
        page: 1
      });
      
      if (transactionsRes.data?.status) {
        setMemberTransactions(transactionsRes.data.data.transactions || []);
      }
    } catch (err) {
      console.error("Error fetching member transactions:", err);
      Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: "Gagal memuat data transaksi anggota.",
      });
      setMemberTransactions([]);
    } finally {
      setTransactionsLoading(false);
    }
  };

  const getTotalSavings = (member) => {
    const current = member.tahun_ini?.total || 0;
    const previous = member.tahun_lalu?.total || 0;
    const twoYearsAgo = member.tahun_lalu2?.total || 0;
    return current + previous + twoYearsAgo;
  };

  const getSavingsBreakdown = (member) => {
    const current = member.tahun_ini;
    const previous = member.tahun_lalu;
    const twoYearsAgo = member.tahun_lalu2;
    
    return {
      current: {
        pokok: current?.pokok || 0,
        wajib: current?.wajib || 0,
        sukarela: current?.sukarela || 0,
        total: current?.total || 0
      },
      previous: {
        pokok: previous?.pokok || 0,
        wajib: previous?.wajib || 0,
        sukarela: previous?.sukarela || 0,
        total: previous?.total || 0
      },
      twoYearsAgo: {
        pokok: twoYearsAgo?.pokok || 0,
        wajib: twoYearsAgo?.wajib || 0,
        sukarela: twoYearsAgo?.sukarela || 0,
        total: twoYearsAgo?.total || 0
      }
    };
  };

  return (
    <div className="members-with-savings-page px-md-4 pb-5">
      {/* Breadcrumb */}
      <div className="mb-2 animate-fade-in">
        <Breadcrumb className="mb-0" style={{ fontSize: "12px" }}>
          <Breadcrumb.Item
            onClick={() => navigate(`/${jwtEncode({ page: "dashboard" })}`)}
            style={{ cursor: "pointer" }}
          >
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() => navigate(`/${jwtEncode({ page: "simpananDashboard" })}`)}
            style={{ cursor: "pointer" }}
          >
            Simpanan
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Anggota Dengan Simpanan</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 animate-fade-in">
        <div>
          <h4 className="fw-bold text-dark mb-1">Daftar Anggota Dengan Simpanan</h4>
          <p className="text-muted small mb-0">
            Daftar anggota yang memiliki simpanan (pokok, wajib, atau sukarela) di koperasi.
          </p>
        </div>
        
        <div className="d-flex gap-2">
          <div className="position-relative">
            <input
              type="text"
              className="form-control ps-4"
              placeholder="Cari nama anggota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: "14px" }}
            />
            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ fontSize: "12px" }}></i>
          </div>
          
          <button
            className="btn btn-outline-secondary"
            onClick={() => setSearchTerm("")}
            disabled={!searchTerm}
            style={{ fontSize: "14px" }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {!loading && membersWithSavings.length > 0 && (
        <div className="row g-3 mb-4 animate-fade-in">
          <div className="col-md-4">
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
                    <i className="bi bi-people text-primary"></i>
                  </div>
                  <div>
                    <p className="text-muted small mb-0">Total Anggota Dengan Simpanan</p>
                    <h5 className="fw-bold text-dark mb-0">{membersWithSavings.length}</h5>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
          
          <div className="col-md-4">
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 p-2 rounded-3 me-3">
                    <i className="bi bi-money-dollar-circle text-success"></i>
                  </div>
                  <div>
                    <p className="text-muted small mb-0">Total Nilai Simpanan</p>
                    <h5 className="fw-bold text-dark mb-0">
                      {formatRupiah(
                        membersWithSavings.reduce((sum, member) => sum + getTotalSavings(member), 0)
                      )}
                    </h5>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
          
          <div className="col-md-4">
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center">
                  <div className="bg-info bg-opacity-10 p-2 rounded-3 me-3">
                    <i className="bi bi-piggy-bank text-info"></i>
                  </div>
                  <div>
                    <p className="text-muted small mb-0">Rata-rata Simpanan per Anggota</p>
                    <h5 className="fw-bold text-dark mb-0">
                      {formatRupiah(
                        membersWithSavings.length > 0 
                          ? membersWithSavings.reduce((sum, member) => sum + getTotalSavings(member), 0) / membersWithSavings.length
                          : 0
                      )}
                    </h5>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}

      {/* Members Table */}
      <div className="animate-fade-in">
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="text-muted mt-2">Memuat data anggota dengan simpanan...</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-people display-1 text-muted opacity-25"></i>
                <p className="text-muted mt-3">
                  {searchTerm
                    ? "Tidak ada anggota yang sesuai dengan pencarian."
                    : "Belum ada anggota yang memiliki simpanan."
                  }
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table className="table table-striped table-hover table-bordered align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "5%" }} className="text-center">No</th>
                      <th style={{ width: "25%" }}>Nama Anggota</th>
                      <th style={{ width: "15%" }} className="text-end">Total Simpanan</th>
                      <th style={{ width: "15%" }} className="text-end">Simpanan Pokok</th>
                      <th style={{ width: "15%" }} className="text-end">Simpanan Wajib</th>
                      <th style={{ width: "15%" }} className="text-end">Simpanan Sukarela</th>
                      <th style={{ width: "10%" }} className="text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member, index) => {
                      const breakdown = getSavingsBreakdown(member);
                      const total = getTotalSavings(member);
                      const current = breakdown.current;
                      
                      return (
                        <tr key={member.id || index}>
                          <td className="text-center">{index + 1}</td>
                          <td>
                            <div className="fw-medium">{member.nama}</div>
                            <div className="text-muted small">
                              {member.member_id || `ID: ${member.id?.substring(0, 8)}...`}
                            </div>
                          </td>
                          <td className="text-end">
                            <div className="fw-medium text-primary">{formatRupiah(total)}</div>
                            <div className="text-muted small">
                              {current.total > 0 && (
                                <span className="badge bg-success bg-opacity-10 text-success">
                                  Tahun Ini: {formatRupiah(current.total)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="text-end">{formatRupiah(current.pokok)}</td>
                          <td className="text-end">{formatRupiah(current.wajib)}</td>
                          <td className="text-end">{formatRupiah(current.sukarela)}</td>
                          <td className="text-center">
                            <Button
                              variant="light"
                              size="sm"
                              className="rounded-circle p-2 text-primary border shadow-none"
                              onClick={() => handleViewTransactions(member)}
                              title="Lihat Transaksi Simpanan"
                            >
                              <Eye size={15} />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      {/* Transaction Details Modal */}
      <Modal
        show={showTransactionModal}
        onHide={() => setShowTransactionModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Detail Transaksi Simpanan - {selectedMember?.nama}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {transactionsLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-2">Memuat transaksi...</p>
            </div>
          ) : memberTransactions.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-receipt display-1 text-muted opacity-25"></i>
              <p className="text-muted mt-2">Tidak ada transaksi simpanan ditemukan.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="table table-striped table-hover table-bordered align-middle mb-0 small">
                <thead className="table-light">
                  <tr>
                    <th>Tanggal</th>
                    <th>Jenis Simpanan</th>
                    <th>Produk</th>
                    <th className="text-end">Jumlah</th>
                    <th>Status</th>
                    <th>Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  {memberTransactions.map((tx) => (
                    <tr key={tx.id || tx.transaction_id}>
                      <td>{new Date(tx.date || tx.created_at).toLocaleDateString('id-ID')}</td>
                      <td>
                        <span className={`badge ${
                          tx.type === 'POKOK' ? 'bg-primary' :
                          tx.type === 'WAJIB' ? 'bg-success' :
                          tx.type === 'SUKARELA' ? 'bg-info' :
                          'bg-secondary'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td>{tx.product_name || tx.type || '-'}</td>
                      <td className="text-end fw-medium">
                        {formatRupiah(tx.amount || 0)}
                      </td>
                      <td>
                        <span className={`badge ${
                          tx.status === 'Selesai' || tx.status === 'COMPLETED' || tx.status === 'APPROVED' ? 'bg-success' :
                          tx.status === 'Pending' || tx.status === 'PENDING' ? 'bg-warning' :
                          tx.status === 'Ditolak' || tx.status === 'REJECTED' ? 'bg-danger' :
                          'bg-secondary'
                        }}`}>
                          {tx.status || 'Pending'}
                        </span>
                      </td>
                      <td className="text-muted small">{tx.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="text-muted small mt-2">
                Total Transaksi: {memberTransactions.length}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTransactionModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MembersWithSavingsPage;