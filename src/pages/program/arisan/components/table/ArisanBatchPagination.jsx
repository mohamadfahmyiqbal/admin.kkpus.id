
import { Card, Pagination } from "react-bootstrap";

const ArisanBatchPagination = ({
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <Card.Footer className="bg-white border-top">
      <div className="d-flex justify-content-between align-items-center">
        <small className="text-muted">
          Menampilkan {(currentPage - 1) * pageSize + 1} -{" "}
          {Math.min(currentPage * pageSize, totalItems)} dari {totalItems} data
        </small>
        <Pagination className="mb-0" size="sm">
          <Pagination.First
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            aria-label="Halaman pertama"
          />
          <Pagination.Prev
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Halaman sebelumnya"
          />
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={idx + 1 === currentPage}
              aria-label={`Halaman ${idx + 1}`}
              aria-current={idx + 1 === currentPage ? "page" : undefined}
              onClick={() => onPageChange(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() =>
              onPageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            aria-label="Halaman berikutnya"
          />
          <Pagination.Last
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Halaman terakhir"
          />
        </Pagination>
      </div>
    </Card.Footer>
  );
};

export default ArisanBatchPagination;
