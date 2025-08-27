import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Spinner,
} from "react-bootstrap";
import UNotif from "../../utils/UNotif";
import { showNotifikasi } from "../../pages/global/Notikasi";

export default function CompNotif() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNotif = useCallback(async () => {
    setLoading(true);
    try {
      // Asumsi response dari API adalah { data: [...] }
      const res = await UNotif.getNotification();
      setData(res.data.data || []);
      // showNotifikasi("success", "Berhasil mengambil notifikasi");
    } catch (error) {
      console.error("Gagal mengambil notifikasi:", error);
      setData([]);
      showNotifikasi("error", "Gagal mengambil notifikasi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getNotif();
  }, [getNotif]);

  return (
    <Card className="shadow mb-4">
      <CardHeader className="bg-topbar text-white">
        <CardTitle as="h5" className="mb-0">
          Notifikasi
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Table striped bordered hover responsive className="mb-0">
          <thead>
            <tr>
              <th>No</th>
              <th>Date</th>
              <th>Notif</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Memuat data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center">
                  Tidak ada notifikasi.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{row.created_at || "-"}</td>
                  <td>{row.body || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
