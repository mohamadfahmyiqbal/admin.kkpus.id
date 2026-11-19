import { Card } from "react-bootstrap";
import { ProtectedImage } from "../../../components/ui/ProtectedImage";
import { ProtectedFileLink } from "../../../components/ui/ProtectedFileLink";

const FALLBACK_DOC_IMAGE = "https://placehold.co/400x300?text=File+Bukan+Gambar";

const TerminationReasonSection = ({ reason, supportingDocumentPath }) => {
  return (
    <>
      <h6 className="fw-bold mb-3 text-dark mt-4">2. Alasan Berhenti</h6>
      <Card className="border-0 shadow-sm rounded-4 p-4 mb-4" style={{ borderColor: "#f1f5f9" }}>
        <p className="text-dark fw-medium mb-4">{reason || "Tidak ada alasan yang diberikan."}</p>
        {supportingDocumentPath && (
          <div className="border-top pt-3">
            <h6 className="fw-bold mb-3 text-dark">Dokumen Pendukung</h6>
            <div className="text-center p-3 border rounded-3 bg-light shadow-sm d-inline-block">
              <ProtectedImage
                path={supportingDocumentPath}
                fallback={FALLBACK_DOC_IMAGE}
                className="img-fluid rounded border shadow-sm"
                alt="Dokumen Pendukung"
                style={{ maxHeight: "200px", objectFit: "contain", backgroundColor: "#fff" }}
              />
              <div className="mt-2">
                <ProtectedFileLink
                  path={supportingDocumentPath}
                  className="btn btn-sm btn-outline-primary"
                >
                  Lihat Dokumen
                </ProtectedFileLink>
              </div>
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

export default TerminationReasonSection;