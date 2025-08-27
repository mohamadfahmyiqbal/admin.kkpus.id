import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from "react-bootstrap";

export default function CompInfo() {
  const financialData = [
    { kategori: "Saldo Kas", jumlah: 49229668 },
    { kategori: "Pinjaman Lunak", jumlah: 924893 },
    { kategori: "Simpanan Pokok", jumlah: 634250000 },
    { kategori: "Simpanan Wajib", jumlah: 206640000 },
    { kategori: "Simpanan Sukarela", jumlah: 107301225 },
    { kategori: "Tabungan Qurban", jumlah: 7090000 },
    { kategori: "Tabungan Umroh", jumlah: 48354600 },
    { kategori: "Tabungan Haji", jumlah: 10000000 },
    { kategori: "Tabungan Pendidikan", jumlah: 6300000 },
    { kategori: "Hibah Pendaftaran ALB", jumlah: 2750000 },
    { kategori: "Program Arisan", jumlah: 25200000 },
    { kategori: "Piutang Anggota", jumlah: 2500000 },
    { kategori: "Piutang Tak Tertagih Pinjaman Lunak", jumlah: 2500000 },
    { kategori: "Pengeluaran Kas Pinjaman Lunak", jumlah: 800000 },
  ];

  // Helper untuk format angka ke rupiah
  const formatRupiah = (angka) =>
    angka.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

  return (
    <Row className="g-3">
      {financialData.map((item, idx) => (
        <Col key={item.kategori} lg="2" md="3" sm="4">
          <Card className="bg-topbar  text-white shadow-sm h-100">
            <CardHeader className="py-3 border-white">
              <CardTitle as="h6" className="mb-1">
                {item.kategori}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="fw-bold fs-5">{formatRupiah(item.jumlah)}</div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
