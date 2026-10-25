import React, { useState } from "react";
import { Modal, Row, Col, Button, Badge, Nav, Tab, Card } from "react-bootstrap";
import {
  User,
  Trash,
  IdentificationCard,
  Phone,
  EnvelopeSimple,
  GenderIntersex,
  MapPin,
  Buildings,
  CreditCard,
  PhoneCall,
  Calendar,
  Wallet,
  Coins,
  Receipt,
  FileImage,
  ShieldCheck,
  CheckCircle,
} from "phosphor-react";

const getMediaUrl = (path) => {
  if (!path) return "";
  const cleanPath = path.replace(/\\/g, "/");
  if (cleanPath.startsWith("http") || cleanPath.startsWith("data:")) return cleanPath;
  const base = (
    import.meta.env.VITE_API_ORIGIN ||
    (import.meta.env.PROD ? "https://api.kkpus.id" : "https://localhost:3445")
  ).replace(/\/$/, "");
  return `${base}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
};

const InfoCard = ({ icon: Icon, label, value, subValue, colProps = { md: 6 } }) => (
  <Col {...colProps}>
    <div className="p-3 border rounded-3 bg-white h-100 shadow-sm d-flex flex-column justify-content-between">
      <div>
        <div className="d-flex align-items-center gap-2 text-muted mb-1">
          {Icon && <Icon size={16} className="text-primary opacity-75" />}
          <small className="fw-semibold text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
            {label}
          </small>
        </div>
        <div className="fw-bold text-dark fs-6 text-break">{value || "-"}</div>
      </div>
      {subValue && <small className="text-muted mt-1">{subValue}</small>}
    </div>
  </Col>
);

const MemberDetailModal = ({ show, onHide, member, onDelete, formatDate, onEditRole }) => {
  const [activeTab, setActiveTab] = useState("semua");

  if (!member) return null;

  // Mendukung bentuk array maupun single object dari berbagai skenario response backend
  const emp =
    (Array.isArray(member.employments) ? member.employments[0] : member.employments) ||
    member.employment ||
    member.employment_info ||
    null;

  const bank =
    (Array.isArray(member.bankAccounts) ? member.bankAccounts[0] : member.bankAccounts) ||
    member.bankAccount ||
    member.bank_info ||
    null;

  const ec =
    (Array.isArray(member.emergencyContacts) ? member.emergencyContacts[0] : member.emergencyContacts) ||
    member.emergencyContact ||
    member.emergency_contact_info ||
    null;

  const bus = member.business || null;
  const fin = member.financial_summary || null;

  const reg =
    (Array.isArray(member.registration) ? member.registration[0] : member.registration) ||
    member.member_registration ||
    null;

  const roles =
    member.roleAssignments && member.roleAssignments.length > 0
      ? member.roleAssignments.map((ra) => ra.role?.role_name).filter(Boolean)
      : [];

  // Susun alamat domisili lengkap menggabungkan field granular dari Member maupun MemberRegistration
  const addressParts = [
    member.address || reg?.address_ktp,
    (member.rt || reg?.rt) && `RT ${member.rt || reg?.rt}`,
    (member.rw || reg?.rw) && `RW ${member.rw || reg?.rw}`,
    reg?.subdistrict_name && `Kel. ${reg.subdistrict_name}`,
    reg?.district_name && `Kec. ${reg.district_name}`,
    reg?.city_name && `Kota/Kab. ${reg.city_name}`,
    reg?.province_name && `Prov. ${reg.province_name}`,
  ].filter(Boolean);

  const fullAddress = addressParts.length > 0 ? addressParts.join(", ") : "-";

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="member-detail-modal">
      <Modal.Header closeButton className="border-0 px-4 pt-4 pb-2">
        <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
          <span>Detail Profil Lengkap Anggota</span>
          <Badge bg="light" text="dark" className="border fw-normal small">
            {member.member_no || member.member_id?.substring(0, 8)}
          </Badge>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 pb-4">
        {/* Banner Header Ringkasan Profil */}
        <div className="p-3 mb-4 rounded-4 bg-primary bg-opacity-10 border border-primary border-opacity-10 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-white text-primary shadow-sm d-flex align-items-center justify-content-center"
              style={{ width: "64px", height: "64px", flexShrink: 0 }}
            >
              <User size={32} weight="bold" />
            </div>
            <div>
              <h5 className="fw-bold text-dark mb-1">{member.full_name}</h5>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <Badge
                  bg={
                    String(member.member_type || "").toLowerCase().includes("reguler")
                      ? "primary"
                      : "warning"
                  }
                  className="rounded-pill px-2.5 py-1"
                >
                  {member.member_type || "Reguler"}
                </Badge>
                <Badge
                  bg={
                    String(member.status?.status_name || "").toUpperCase() === "AKTIF"
                      ? "success"
                      : "secondary"
                  }
                  className="rounded-pill px-2.5 py-1"
                >
                  {member.status?.status_name || "Aktif"}
                </Badge>
                {roles.length > 0 ? (
                  roles.map((r, i) => (
                    <Badge key={i} bg="dark" className="rounded-pill px-2.5 py-1">
                      {r}
                    </Badge>
                  ))
                ) : (
                  <Badge bg="light" text="muted" className="border rounded-pill px-2.5 py-1">
                    Anggota
                  </Badge>
                )}
                {onEditRole && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 text-primary text-decoration-none small fw-semibold"
                    onClick={() => onEditRole(member)}
                    title="Ubah Role Anggota"
                  >
                    (Ubah Role)
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="text-sm-end text-muted small">
            Bergabung sejak:
            <div className="fw-semibold text-dark">
              {formatDate
                ? formatDate(member.join_date || member.created_at || member.createdAt)
                : (member.join_date || "-")}
            </div>
          </div>
        </div>

        {/* Tab Navigasi Kategori Data */}
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Nav variant="pills" className="bg-light p-1 rounded-3 mb-3 gap-1">
            <Nav.Item>
              <Nav.Link eventKey="semua" className="py-1.5 px-3 rounded-2 small fw-semibold">
                Semua Informasi
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="pribadi" className="py-1.5 px-3 rounded-2 small fw-semibold">
                Biodata
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="keuangan" className="py-1.5 px-3 rounded-2 small fw-semibold">
                Simpanan & Finansial
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="pekerjaan" className="py-1.5 px-3 rounded-2 small fw-semibold">
                Pekerjaan & Rekening
              </Nav.Link>
            </Nav.Item>
            {(reg?.ktp_photo_path || reg?.selfie_photo_path) && (
              <Nav.Item>
                <Nav.Link eventKey="dokumen" className="py-1.5 px-3 rounded-2 small fw-semibold">
                  Dokumen KTP
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>

          <Tab.Content className="pt-2">
            {/* Tab 0: Semua Informasi (Ditampilkan langsung agar tidak tersembunyi) */}
            <Tab.Pane eventKey="semua">
              <div className="d-flex flex-column gap-4">
                {/* 1. Biodata */}
                <div>
                  <h6 className="fw-bold text-dark mb-2.5 small text-uppercase d-flex align-items-center gap-1.5">
                    <User size={16} className="text-primary" /> Biodata & Kontak Anggota
                  </h6>
                  <Row className="g-3">
                    <InfoCard
                      icon={IdentificationCard}
                      label="Nomor Induk Kependudukan (NIK)"
                      value={member.nik_ktp || reg?.nik_ktp}
                    />
                    <InfoCard
                      icon={Phone}
                      label="Nomor Telepon / WhatsApp"
                      value={member.phone_number || reg?.phone_number}
                    />
                    <InfoCard
                      icon={EnvelopeSimple}
                      label="Alamat Email"
                      value={member.email || reg?.email}
                    />
                    <InfoCard
                      icon={GenderIntersex}
                      label="Jenis Kelamin"
                      value={
                        member.gender === "L"
                          ? "Laki-laki"
                          : member.gender === "P"
                          ? "Perempuan"
                          : member.gender
                      }
                    />
                    <InfoCard
                      icon={Calendar}
                      label="Tanggal Lahir"
                      value={
                        member.date_of_brith
                          ? formatDate
                            ? formatDate(member.date_of_brith)
                            : member.date_of_brith
                          : "-"
                      }
                    />
                    <InfoCard
                      icon={Calendar}
                      label="Tanggal Registrasi Akun"
                      value={
                        formatDate
                          ? formatDate(member.created_at || member.createdAt)
                          : "-"
                      }
                    />
                    <InfoCard
                      icon={MapPin}
                      label="Alamat Lengkap Domisili"
                      value={fullAddress}
                      colProps={{ md: 12 }}
                    />
                  </Row>
                </div>

                {/* 2. Pekerjaan & Rekening */}
                <div>
                  <h6 className="fw-bold text-dark mb-2.5 small text-uppercase d-flex align-items-center gap-1.5">
                    <Buildings size={16} className="text-primary" /> Pekerjaan, Rekening & Usaha
                  </h6>
                  <Row className="g-3">
                    <InfoCard
                      icon={Buildings}
                      label="Pekerjaan / Jabatan"
                      value={emp?.occupation}
                      subValue={emp?.employer_name ? `Instansi: ${emp.employer_name}` : null}
                    />
                    <InfoCard
                      icon={MapPin}
                      label="Alamat Tempat Kerja"
                      value={emp?.employer_address}
                    />
                    <InfoCard
                      icon={Buildings}
                      label="Nama Usaha Mandiri"
                      value={bus?.business_name}
                      subValue={
                        bus?.monthly_revenue
                          ? `Omzet: Rp ${Number(bus.monthly_revenue).toLocaleString("id-ID")}/bln`
                          : null
                      }
                    />
                    <InfoCard
                      icon={CreditCard}
                      label="Rekening Bank Penarikan / Setoran"
                      value={bank ? `${bank.bank_name || "-"} - ${bank.bank_account_no || "-"}` : "-"}
                      subValue={bank?.account_holder ? `a.n ${bank.account_holder}` : null}
                    />
                    <InfoCard
                      icon={PhoneCall}
                      label="Kontak Darurat"
                      value={ec?.contact_name}
                      subValue={
                        ec
                          ? `${ec.relation || "Hubungan keluarga"} • ${ec.phone_number || "-"}`
                          : null
                      }
                      colProps={{ md: 12 }}
                    />
                  </Row>
                </div>

                {/* 3. Finansial */}
                <div>
                  <h6 className="fw-bold text-dark mb-2.5 small text-uppercase d-flex align-items-center gap-1.5">
                    <Wallet size={16} className="text-primary" /> Simpanan & Finansial Koperasi
                  </h6>
                  {fin ? (
                    <div>
                      <Row className="g-3 mb-3">
                        <Col sm={6} md={3}>
                          <div className="p-3 border rounded-3 bg-success bg-opacity-10 text-center h-100">
                            <small className="text-success fw-bold d-block mb-1">Simpanan Pokok</small>
                            <h6 className="fw-bold text-dark mb-0">
                              Rp {Number(fin.simpanan_pokok || 0).toLocaleString("id-ID")}
                            </h6>
                          </div>
                        </Col>
                        <Col sm={6} md={3}>
                          <div className="p-3 border rounded-3 bg-success bg-opacity-10 text-center h-100">
                            <small className="text-success fw-bold d-block mb-1">Simpanan Wajib</small>
                            <h6 className="fw-bold text-dark mb-0">
                              Rp {Number(fin.simpanan_wajib || 0).toLocaleString("id-ID")}
                            </h6>
                          </div>
                        </Col>
                        <Col sm={6} md={3}>
                          <div className="p-3 border rounded-3 bg-primary bg-opacity-10 text-center h-100">
                            <small className="text-primary fw-bold d-block mb-1">Simpanan Sukarela</small>
                            <h6 className="fw-bold text-dark mb-0">
                              Rp {Number(fin.simpanan_sukarela || 0).toLocaleString("id-ID")}
                            </h6>
                          </div>
                        </Col>
                        <Col sm={6} md={3}>
                          <div className="p-3 border rounded-3 bg-info bg-opacity-10 text-center h-100">
                            <small className="text-info fw-bold d-block mb-1">Tabungan Reguler</small>
                            <h6 className="fw-bold text-dark mb-0">
                              Rp {Number(fin.tabungan_reguler || 0).toLocaleString("id-ID")}
                            </h6>
                          </div>
                        </Col>
                      </Row>

                      <Row className="g-3">
                        <InfoCard
                          icon={Coins}
                          label="Investasi Halal"
                          value={`Rp ${Number(fin.total_investasi || 0).toLocaleString("id-ID")}`}
                          colProps={{ sm: 6, md: 3 }}
                        />
                        <InfoCard
                          icon={Coins}
                          label="Pendanaan Syariah"
                          value={`Rp ${Number(fin.total_pendanaan_syariah || 0).toLocaleString("id-ID")}`}
                          colProps={{ sm: 6, md: 3 }}
                        />
                        <InfoCard
                          icon={Receipt}
                          label="Total Pinjaman Terbayar"
                          value={`Rp ${Number(fin.pinjaman_terbayar || 0).toLocaleString("id-ID")}`}
                          subValue={`Sisa: Rp ${Number(fin.pinjaman_sisa_cicilan || 0).toLocaleString("id-ID")}`}
                          colProps={{ sm: 6, md: 3 }}
                        />
                        <InfoCard
                          icon={Receipt}
                          label="Arisan Diikuti"
                          value={`${fin.arisan_diikuti_count || 0} Batch`}
                          subValue={`Terbayar: Rp ${Number(fin.arisan_terbayar || 0).toLocaleString("id-ID")}`}
                          colProps={{ sm: 6, md: 3 }}
                        />
                      </Row>
                    </div>
                  ) : (
                    <div className="p-3 text-center text-muted bg-light rounded-3 border">
                      <small>Belum ada ringkasan simpanan finansial tercatat untuk anggota ini.</small>
                    </div>
                  )}
                </div>

                {/* 4. Dokumen KTP jika ada */}
                {(reg?.ktp_photo_path || reg?.selfie_photo_path) && (
                  <div>
                    <h6 className="fw-bold text-dark mb-2.5 small text-uppercase d-flex align-items-center gap-1.5">
                      <FileImage size={16} className="text-primary" /> Dokumen Registrasi
                    </h6>
                    <Row className="g-3">
                      {reg.ktp_photo_path && (
                        <Col md={6}>
                          <Card className="border shadow-none text-center p-3 h-100">
                            <small className="fw-bold text-muted mb-2 d-block">Foto KTP</small>
                            <a href={getMediaUrl(reg.ktp_photo_path)} target="_blank" rel="noopener noreferrer">
                              <img
                                src={getMediaUrl(reg.ktp_photo_path)}
                                alt="Foto KTP"
                                className="img-fluid rounded border shadow-sm"
                                style={{ maxHeight: "180px", objectFit: "contain", width: "100%", cursor: "zoom-in" }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://placehold.co/400x300?text=KTP+Tidak+Ditemukan";
                                }}
                              />
                            </a>
                          </Card>
                        </Col>
                      )}
                      {reg.selfie_photo_path && (
                        <Col md={6}>
                          <Card className="border shadow-none text-center p-3 h-100">
                            <small className="fw-bold text-muted mb-2 d-block">Swafoto (Selfie)</small>
                            <a href={getMediaUrl(reg.selfie_photo_path)} target="_blank" rel="noopener noreferrer">
                              <img
                                src={getMediaUrl(reg.selfie_photo_path)}
                                alt="Swafoto"
                                className="img-fluid rounded border shadow-sm"
                                style={{ maxHeight: "180px", objectFit: "contain", width: "100%", cursor: "zoom-in" }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://placehold.co/400x300?text=Swafoto+Tidak+Ditemukan";
                                }}
                              />
                            </a>
                          </Card>
                        </Col>
                      )}
                    </Row>
                  </div>
                )}
              </div>
            </Tab.Pane>

            {/* Tab 1: Biodata Spesifik */}
            <Tab.Pane eventKey="pribadi">
              <Row className="g-3">
                <InfoCard
                  icon={IdentificationCard}
                  label="Nomor Induk Kependudukan (NIK)"
                  value={member.nik_ktp || reg?.nik_ktp}
                />
                <InfoCard
                  icon={Phone}
                  label="Nomor Telepon / WhatsApp"
                  value={member.phone_number || reg?.phone_number}
                />
                <InfoCard
                  icon={EnvelopeSimple}
                  label="Alamat Email"
                  value={member.email || reg?.email}
                />
                <InfoCard
                  icon={GenderIntersex}
                  label="Jenis Kelamin"
                  value={
                    member.gender === "L"
                      ? "Laki-laki"
                      : member.gender === "P"
                      ? "Perempuan"
                      : member.gender
                  }
                />
                <InfoCard
                  icon={Calendar}
                  label="Tanggal Lahir"
                  value={
                    member.date_of_brith
                      ? formatDate
                        ? formatDate(member.date_of_brith)
                        : member.date_of_brith
                      : "-"
                  }
                />
                <InfoCard
                  icon={Calendar}
                  label="Tanggal Registrasi Akun"
                  value={
                    formatDate
                      ? formatDate(member.created_at || member.createdAt)
                      : "-"
                  }
                />
                <InfoCard
                  icon={MapPin}
                  label="Alamat Lengkap Domisili"
                  value={fullAddress}
                  colProps={{ md: 12 }}
                />
              </Row>
            </Tab.Pane>

            {/* Tab 2: Finansial Spesifik */}
            <Tab.Pane eventKey="keuangan">
              {fin ? (
                <div>
                  <h6 className="fw-bold text-dark mb-3 small text-uppercase">Kolektif Simpanan & Tabungan</h6>
                  <Row className="g-3 mb-4">
                    <Col sm={6} md={3}>
                      <div className="p-3 border rounded-3 bg-success bg-opacity-10 text-center h-100">
                        <small className="text-success fw-bold d-block mb-1">Simpanan Pokok</small>
                        <h6 className="fw-bold text-dark mb-0">
                          Rp {Number(fin.simpanan_pokok || 0).toLocaleString("id-ID")}
                        </h6>
                      </div>
                    </Col>
                    <Col sm={6} md={3}>
                      <div className="p-3 border rounded-3 bg-success bg-opacity-10 text-center h-100">
                        <small className="text-success fw-bold d-block mb-1">Simpanan Wajib</small>
                        <h6 className="fw-bold text-dark mb-0">
                          Rp {Number(fin.simpanan_wajib || 0).toLocaleString("id-ID")}
                        </h6>
                      </div>
                    </Col>
                    <Col sm={6} md={3}>
                      <div className="p-3 border rounded-3 bg-primary bg-opacity-10 text-center h-100">
                        <small className="text-primary fw-bold d-block mb-1">Simpanan Sukarela</small>
                        <h6 className="fw-bold text-dark mb-0">
                          Rp {Number(fin.simpanan_sukarela || 0).toLocaleString("id-ID")}
                        </h6>
                      </div>
                    </Col>
                    <Col sm={6} md={3}>
                      <div className="p-3 border rounded-3 bg-info bg-opacity-10 text-center h-100">
                        <small className="text-info fw-bold d-block mb-1">Tabungan Reguler</small>
                        <h6 className="fw-bold text-dark mb-0">
                          Rp {Number(fin.tabungan_reguler || 0).toLocaleString("id-ID")}
                        </h6>
                      </div>
                    </Col>
                  </Row>

                  <h6 className="fw-bold text-dark mb-3 small text-uppercase">Portofolio & Pinjaman / Pembiayaan</h6>
                  <Row className="g-3">
                    <InfoCard
                      icon={Coins}
                      label="Investasi Halal"
                      value={`Rp ${Number(fin.total_investasi || 0).toLocaleString("id-ID")}`}
                      colProps={{ sm: 6, md: 3 }}
                    />
                    <InfoCard
                      icon={Coins}
                      label="Pendanaan Syariah"
                      value={`Rp ${Number(fin.total_pendanaan_syariah || 0).toLocaleString("id-ID")}`}
                      colProps={{ sm: 6, md: 3 }}
                    />
                    <InfoCard
                      icon={Receipt}
                      label="Total Pinjaman Terbayar"
                      value={`Rp ${Number(fin.pinjaman_terbayar || 0).toLocaleString("id-ID")}`}
                      subValue={`Sisa: Rp ${Number(fin.pinjaman_sisa_cicilan || 0).toLocaleString("id-ID")}`}
                      colProps={{ sm: 6, md: 3 }}
                    />
                    <InfoCard
                      icon={Receipt}
                      label="Arisan Diikuti"
                      value={`${fin.arisan_diikuti_count || 0} Batch`}
                      subValue={`Terbayar: Rp ${Number(fin.arisan_terbayar || 0).toLocaleString("id-ID")}`}
                      colProps={{ sm: 6, md: 3 }}
                    />
                  </Row>
                </div>
              ) : (
                <div className="text-center py-4 text-muted bg-light rounded-3">
                  <Wallet size={32} className="mb-2 text-muted opacity-50" />
                  <p className="mb-0 small">Belum ada data ringkasan finansial untuk anggota ini.</p>
                </div>
              )}
            </Tab.Pane>

            {/* Tab 3: Pekerjaan Spesifik */}
            <Tab.Pane eventKey="pekerjaan">
              <Row className="g-3">
                <InfoCard
                  icon={Buildings}
                  label="Pekerjaan / Jabatan"
                  value={emp?.occupation}
                  subValue={emp?.employer_name ? `Instansi: ${emp.employer_name}` : null}
                />
                <InfoCard
                  icon={MapPin}
                  label="Alamat Tempat Kerja"
                  value={emp?.employer_address}
                />
                <InfoCard
                  icon={Buildings}
                  label="Nama Usaha Mandiri"
                  value={bus?.business_name}
                  subValue={
                    bus?.monthly_revenue
                      ? `Omzet: Rp ${Number(bus.monthly_revenue).toLocaleString("id-ID")}/bln`
                      : null
                  }
                />
                <InfoCard
                  icon={CreditCard}
                  label="Rekening Bank Penarikan / Setoran"
                  value={bank ? `${bank.bank_name || "-"} - ${bank.bank_account_no || "-"}` : "-"}
                  subValue={bank?.account_holder ? `a.n ${bank.account_holder}` : null}
                />
                <InfoCard
                  icon={PhoneCall}
                  label="Kontak Darurat"
                  value={ec?.contact_name}
                  subValue={
                    ec
                      ? `${ec.relation || "Hubungan keluarga"} • ${ec.phone_number || "-"}`
                      : null
                  }
                  colProps={{ md: 12 }}
                />
              </Row>
            </Tab.Pane>

            {/* Tab 4: Dokumen Spesifik */}
            {(reg?.ktp_photo_path || reg?.selfie_photo_path) && (
              <Tab.Pane eventKey="dokumen">
                <Row className="g-3">
                  {reg.ktp_photo_path && (
                    <Col md={6}>
                      <Card className="border shadow-none text-center p-3 h-100">
                        <small className="fw-bold text-muted mb-2 d-block">Foto KTP Anggota</small>
                        <a href={getMediaUrl(reg.ktp_photo_path)} target="_blank" rel="noopener noreferrer">
                          <img
                            src={getMediaUrl(reg.ktp_photo_path)}
                            alt="Foto KTP"
                            className="img-fluid rounded border shadow-sm"
                            style={{ maxHeight: "200px", objectFit: "contain", width: "100%", cursor: "zoom-in" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/400x300?text=KTP+Tidak+Ditemukan";
                            }}
                          />
                        </a>
                      </Card>
                    </Col>
                  )}
                  {reg.selfie_photo_path && (
                    <Col md={6}>
                      <Card className="border shadow-none text-center p-3 h-100">
                        <small className="fw-bold text-muted mb-2 d-block">Swafoto (Selfie) Anggota</small>
                        <a href={getMediaUrl(reg.selfie_photo_path)} target="_blank" rel="noopener noreferrer">
                          <img
                            src={getMediaUrl(reg.selfie_photo_path)}
                            alt="Swafoto"
                            className="img-fluid rounded border shadow-sm"
                            style={{ maxHeight: "200px", objectFit: "contain", width: "100%", cursor: "zoom-in" }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/400x300?text=Swafoto+Tidak+Ditemukan";
                            }}
                          />
                        </a>
                      </Card>
                    </Col>
                  )}
                </Row>
              </Tab.Pane>
            )}
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>

      <Modal.Footer className="border-0 px-4 pb-4 d-flex justify-content-between">
        <Button
          variant="outline-danger"
          className="d-flex align-items-center gap-2 fw-semibold shadow-none"
          onClick={() => onDelete(member?.member_id)}
        >
          <Trash size={16} /> Hapus Anggota Ini
        </Button>
        <Button variant="secondary" className="px-4" onClick={onHide}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(MemberDetailModal);
