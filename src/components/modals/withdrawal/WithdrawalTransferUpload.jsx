import React from "react";
import { Form } from "react-bootstrap";
import { UploadSimple, CheckCircle } from "phosphor-react";

export const WithdrawalTransferUpload = ({
  file,
  preview,
  onFileChange,
}) => {
  return (
    <div className="border-top pt-4 mb-3">
      <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
        <UploadSimple size={18} className="text-primary" />
        Upload Bukti Transfer Bank
      </h6>
      <Form.Group className="mb-3">
        <div
          className={`upload-zone rounded-4 border-2 border-dashed p-4 text-center cursor-pointer transition-all ${
            preview ? "border-success bg-success bg-opacity-5" : "border-light bg-light bg-opacity-50"
          }`}
          style={{ cursor: "pointer" }}
          onClick={() => document.getElementById("withdrawalTransferFile").click()}
        >
          <input
            type="file"
            id="withdrawalTransferFile"
            hidden
            accept="image/*,application/pdf"
            onChange={onFileChange}
          />
          {preview ? (
            <div className="d-flex align-items-center justify-content-center gap-3">
              {preview === "pdf" ? (
                <div
                  className="bg-danger bg-opacity-10 text-danger rounded-3 p-3 d-flex align-items-center justify-content-center"
                  style={{ width: "60px", height: "60px" }}
                >
                  <span className="fw-bold small">PDF</span>
                </div>
              ) : (
                <img
                  src={preview}
                  alt="Bukti Transfer"
                  className="rounded-3 shadow-sm"
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                />
              )}
              <div className="text-start">
                <p className="mb-0 fw-bold text-success small">Bukti Terpilih</p>
                <p className="mb-0 text-muted extra-small">{file?.name}</p>
              </div>
              <CheckCircle size={24} className="text-success ms-auto" weight="fill" />
            </div>
          ) : (
            <div className="py-2">
              <UploadSimple size={32} className="text-primary opacity-50 mb-2" />
              <p className="mb-0 fw-bold text-dark small">Klik untuk Unggah Bukti Transfer</p>
              <p className="mb-0 text-muted extra-small">Format JPG, PNG atau PDF (Maks. 2MB)</p>
            </div>
          )}
        </div>
      </Form.Group>
    </div>
  );
};

export default WithdrawalTransferUpload;
