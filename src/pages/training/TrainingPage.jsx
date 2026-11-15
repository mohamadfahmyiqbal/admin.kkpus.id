import React, { useState, useEffect } from "react";
import {
  Tab,
  Nav,
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import Swal from "sweetalert2";
import { Plus, PencilSimple, Trash } from "phosphor-react";
import api from "../../utils/api/common";

const BASE_URL = "/training/admin";

const trainingService = {
  getCurriculums: () => api.get(`${BASE_URL}/curriculums`),
  createCurriculum: (data) => api.post(`${BASE_URL}/curriculums`, data),
  updateCurriculum: (id, data) => api.put(`${BASE_URL}/curriculums/${id}`, data),
  deleteCurriculum: (id) => api.delete(`${BASE_URL}/curriculums/${id}`),

  getMaterials: () => api.get(`${BASE_URL}/materials`),
  createMaterial: (data) => api.post(`${BASE_URL}/materials`, data),
  updateMaterial: (id, data) => api.put(`${BASE_URL}/materials/${id}`, data),
  deleteMaterial: (id) => api.delete(`${BASE_URL}/materials/${id}`),

  getEvaluations: () => api.get(`${BASE_URL}/evaluations`),
  createEvaluation: (data) => api.post(`${BASE_URL}/evaluations`, data),
  updateEvaluation: (id, data) => api.put(`${BASE_URL}/evaluations/${id}`, data),
  deleteEvaluation: (id) => api.delete(`${BASE_URL}/evaluations/${id}`),

  getRankings: () => api.get(`${BASE_URL}/rankings`),
};

// TAB 1: KURIKULUM
const CurriculumTab = ({ onEdit }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCurriculums = async () => {
    setLoading(true);
    try {
      const res = await trainingService.getCurriculums();
      if (res.data?.status) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load curriculums", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculums();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Kurikulum?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await trainingService.deleteCurriculum(id);
        Swal.fire("Terhapus", "Kurikulum berhasil dihapus", "success");
        fetchCurriculums();
      } catch {
        Swal.fire("Gagal", "Tidak dapat menghapus kurikulum", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-4 shadow-sm p-4">
      <Table responsive hover className="align-middle border-top-0 mb-0">
        <thead className="table-light">
          <tr>
            <th className="text-secondary fw-semibold border-0 rounded-start-2">
              No
            </th>
            <th className="text-secondary fw-semibold border-0">
              Nama Kurikulum
            </th>
            <th className="text-secondary fw-semibold border-0">Tipe</th>
            <th className="text-secondary fw-semibold border-0">Status</th>
            <th className="text-secondary fw-semibold border-0 text-center rounded-end-2">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, idx) => (
              <tr key={item.curriculum_id}>
                <td>{idx + 1}</td>
                <td className="fw-medium text-dark">{item.curriculum_name}</td>
                <td>
                  <Badge
                    bg={item.curriculum_type === "WAJIB" ? "danger" : "info"}
                    className="rounded-pill px-3 py-2"
                  >
                    {item.curriculum_type}
                  </Badge>
                </td>
                <td>
                  <Badge
                    bg={item.is_active ? "success" : "secondary"}
                    className="rounded-pill px-3 py-2"
                  >
                    {item.is_active ? "Aktif" : "Non-Aktif"}
                  </Badge>
                </td>
                <td className="text-center">
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => onEdit(item)}
                      className="text-primary rounded-circle"
                      style={{ width: "32px", height: "32px", padding: 0 }}
                    >
                      <PencilSimple size={16} />
                    </Button>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => handleDelete(item.curriculum_id)}
                      className="text-danger rounded-circle"
                      style={{ width: "32px", height: "32px", padding: 0 }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4 text-muted">
                Belum ada data kurikulum.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

// TAB 2: MATERI
const MaterialTab = ({ onEdit }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const res = await trainingService.getMaterials();
      if (res.data?.status) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load materials", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Materi?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await trainingService.deleteMaterial(id);
        Swal.fire("Terhapus", "Materi berhasil dihapus", "success");
        fetchMaterials();
      } catch {
        Swal.fire("Gagal", "Tidak dapat menghapus materi", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-4 shadow-sm p-4">
      <Table responsive hover className="align-middle border-top-0 mb-0">
        <thead className="table-light">
          <tr>
            <th className="text-secondary fw-semibold border-0 rounded-start-2">
              Urutan
            </th>
            <th className="text-secondary fw-semibold border-0">Judul Materi</th>
            <th className="text-secondary fw-semibold border-0">Tipe</th>
            <th className="text-secondary fw-semibold border-0 text-center rounded-end-2">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.material_id}>
                <td>{item.sequence_no}</td>
                <td className="fw-medium text-dark">{item.material_name}</td>
                <td>{item.material_type}</td>
                <td className="text-center">
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => onEdit(item)}
                      className="text-primary rounded-circle"
                      style={{ width: "32px", height: "32px", padding: 0 }}
                    >
                      <PencilSimple size={16} />
                    </Button>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => handleDelete(item.material_id)}
                      className="text-danger rounded-circle"
                      style={{ width: "32px", height: "32px", padding: 0 }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4 text-muted">
                Belum ada data materi.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

// TAB 3: EVALUASI
const EvaluationTab = ({ onEdit }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvaluations = async () => {
    setLoading(true);
    try {
      const res = await trainingService.getEvaluations();
      if (res.data?.status) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load evaluations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Evaluasi?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await trainingService.deleteEvaluation(id);
        Swal.fire("Terhapus", "Soal evaluasi berhasil dihapus", "success");
        fetchEvaluations();
      } catch {
        Swal.fire("Gagal", "Tidak dapat menghapus soal evaluasi", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-4 shadow-sm p-4">
      <Table responsive hover className="align-middle border-top-0 mb-0">
        <thead className="table-light">
          <tr>
            <th className="text-secondary fw-semibold border-0 rounded-start-2">
              Pertanyaan
            </th>
            <th className="text-secondary fw-semibold border-0">Kunci Jawaban</th>
            <th className="text-secondary fw-semibold border-0">Poin</th>
            <th className="text-secondary fw-semibold border-0 text-center rounded-end-2">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.evaluation_id}>
                <td className="fw-medium text-dark">{item.question}</td>
                <td>{item.correct_answer}</td>
                <td>{item.points}</td>
                <td className="text-center">
                  <div className="d-flex gap-2 justify-content-center">
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => onEdit(item)}
                      className="text-primary rounded-circle"
                      style={{ width: "32px", height: "32px", padding: 0 }}
                    >
                      <PencilSimple size={16} />
                    </Button>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => handleDelete(item.evaluation_id)}
                      className="text-danger rounded-circle"
                      style={{ width: "32px", height: "32px", padding: 0 }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4 text-muted">
                Belum ada data evaluasi.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

// TAB 4: LAPORAN & RANKING
const RankingTab = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const res = await trainingService.getRankings();
      if (res.data?.status) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load rankings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-4 shadow-sm p-4">
      <Table responsive hover className="align-middle border-top-0 mb-0">
        <thead className="table-light">
          <tr>
            <th className="text-secondary fw-semibold border-0 rounded-start-2">
              Peringkat
            </th>
            <th className="text-secondary fw-semibold border-0">Nama Anggota</th>
            <th className="text-secondary fw-semibold border-0">Total Skor</th>
            <th className="text-secondary fw-semibold border-0 text-center rounded-end-2">
              Materi Selesai
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, idx) => (
              <tr key={item.ranking_id}>
                <td>
                  <div
                    className={`fw-bold d-flex align-items-center justify-content-center rounded-circle ${
                      idx === 0
                        ? "bg-warning text-white"
                        : idx === 1
                        ? "bg-secondary text-white"
                        : idx === 2
                        ? "bg-orange text-white"
                        : "bg-light text-muted"
                    }`}
                    style={{ width: "32px", height: "32px" }}
                  >
                    {idx + 1}
                  </div>
                </td>
                <td className="fw-medium text-dark">
                  {item.user?.nama_lengkap || "Unknown"}
                </td>
                <td className="text-primary fw-bold">{item.total_score}</td>
                <td className="text-center">{item.materials_completed}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4 text-muted">
                Belum ada data ranking.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

// MODAL CURRICULUM
const CurriculumModal = ({ show, onHide, curriculum, onSuccess }) => {
  const [form, setForm] = useState({
    curriculum_name: "",
    curriculum_type: "WAJIB",
    description: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(
      curriculum
        ? {
            curriculum_name: curriculum.curriculum_name || "",
            curriculum_type: curriculum.curriculum_type || "WAJIB",
            description: curriculum.description || "",
            is_active:
              curriculum.is_active === undefined ? true : curriculum.is_active,
          }
        : {
            curriculum_name: "",
            curriculum_type: "WAJIB",
            description: "",
            is_active: true,
          }
    );
  }, [curriculum, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (curriculum) {
        await trainingService.updateCurriculum(curriculum.curriculum_id, form);
        Swal.fire("Berhasil", "Kurikulum diperbarui", "success");
      } else {
        await trainingService.createCurriculum(form);
        Swal.fire("Berhasil", "Kurikulum dibuat", "success");
      }
      onSuccess();
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Terjadi kesalahan",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          {curriculum ? "Edit Kurikulum" : "Tambah Kurikulum"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium text-dark small">
              Nama Kurikulum <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="curriculum_name"
              value={form.curriculum_name}
              onChange={handleChange}
              placeholder="Masukkan nama kurikulum"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium text-dark small">
              Tipe Kurikulum <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="curriculum_type"
              value={form.curriculum_type}
              onChange={handleChange}
              required
            >
              <option value="WAJIB">Wajib</option>
              <option value="REGULER">Reguler</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium text-dark small">
              Deskripsi
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Masukkan deskripsi kurikulum"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="is_active_switch"
              label="Status Aktif"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onHide} disabled={loading}>
            Batal
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Simpan"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

// MODAL MATERIAL
const MaterialModal = ({ show, onHide, material, onSuccess }) => {
  const [form, setForm] = useState({
    curriculum_id: "",
    material_name: "",
    material_type: "ARTICLE",
    content: "",
    media_url: "",
    sequence_no: 1,
  });
  const [curriculums, setCurriculums] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      loadCurriculums();
      setForm(
        material
          ? {
              curriculum_id: material.curriculum_id || "",
              material_name: material.material_name || "",
              material_type: material.material_type || "ARTICLE",
              content: material.content || "",
              media_url: material.media_url || "",
              sequence_no: material.sequence_no || 1,
            }
          : {
              curriculum_id: "",
              material_name: "",
              material_type: "ARTICLE",
              content: "",
              media_url: "",
              sequence_no: 1,
            }
      );
    }
  }, [material, show]);

  const loadCurriculums = async () => {
    try {
      const res = await trainingService.getCurriculums();
      if (res.data?.status) setCurriculums(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (material) {
        await trainingService.updateMaterial(material.material_id, form);
        Swal.fire("Berhasil", "Materi diperbarui", "success");
      } else {
        await trainingService.createMaterial(form);
        Swal.fire("Berhasil", "Materi dibuat", "success");
      }
      onSuccess();
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Terjadi kesalahan",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          {material ? "Edit Materi" : "Tambah Materi"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium text-dark small">
                  Kurikulum <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="curriculum_id"
                  value={form.curriculum_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Kurikulum</option>
                  {curriculums.map((c) => (
                    <option key={c.curriculum_id} value={c.curriculum_id}>
                      {c.curriculum_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium text-dark small">
                  Judul Materi <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="material_name"
                  value={form.material_name}
                  onChange={handleChange}
                  placeholder="Judul Materi"
                  required
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium text-dark small">
                  Tipe Materi <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="material_type"
                  value={form.material_type}
                  onChange={handleChange}
                  required
                >
                  <option value="ARTICLE">Artikel</option>
                  <option value="VIDEO">Video</option>
                  <option value="DOCUMENT">Dokumen</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium text-dark small">
                  Urutan <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="sequence_no"
                  value={form.sequence_no}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
          </div>
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium text-dark small">
              URL Media (Video/Doc)
            </Form.Label>
            <Form.Control
              type="text"
              name="media_url"
              value={form.media_url}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium text-dark small">
              Konten Materi
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Teks atau format HTML"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onHide} disabled={loading}>
            Batal
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Simpan"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

// MODAL EVALUATION
const EvaluationModal = ({ show, onHide, evaluation, onSuccess }) => {
  const [form, setForm] = useState({
    material_id: "",
    question: "",
    options: { A: "", B: "", C: "", D: "" },
    correct_answer: "A",
    points: 10,
  });
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      loadMaterials();
      setForm(
        evaluation
          ? {
              material_id: evaluation.material_id || "",
              question: evaluation.question || "",
              options: evaluation.options || { A: "", B: "", C: "", D: "" },
              correct_answer: evaluation.correct_answer || "A",
              points: evaluation.points || 10,
            }
          : {
              material_id: "",
              question: "",
              options: { A: "", B: "", C: "", D: "" },
              correct_answer: "A",
              points: 10,
            }
      );
    }
  }, [evaluation, show]);

  const loadMaterials = async () => {
    try {
      const res = await trainingService.getMaterials();
      if (res.data?.status) setMaterials(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (key, val) => {
    setForm((prev) => ({
      ...prev,
      options: { ...prev.options, [key]: val },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (evaluation) {
        await trainingService.updateEvaluation(evaluation.evaluation_id, form);
        Swal.fire("Berhasil", "Soal diperbarui", "success");
      } else {
        await trainingService.createEvaluation(form);
        Swal.fire("Berhasil", "Soal dibuat", "success");
      }
      onSuccess();
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Terjadi kesalahan",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          {evaluation ? "Edit Soal Evaluasi" : "Tambah Soal Evaluasi"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="row">
            <div className="col-md-8">
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium text-dark small">
                  Terkait Materi <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="material_id"
                  value={form.material_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih Materi</option>
                  {materials.map((m) => (
                    <option key={m.material_id} value={m.material_id}>
                      {m.material_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label className="fw-medium text-dark small">
                  Poin <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="points"
                  value={form.points}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
          </div>
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium text-dark small">
              Pertanyaan <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="question"
              value={form.question}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Label className="fw-medium text-dark small">
            Pilihan Ganda <span className="text-danger">*</span>
          </Form.Label>
          <div className="row mb-3">
            {["A", "B", "C", "D"].map((opt) => (
              <div key={opt} className="col-md-6 mb-2">
                <div className="d-flex align-items-center">
                  <span className="me-2 fw-bold">{opt}.</span>
                  <Form.Control
                    type="text"
                    value={form.options[opt]}
                    onChange={(e) => handleOptionChange(opt, e.target.value)}
                    required
                  />
                </div>
              </div>
            ))}
          </div>
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium text-dark small">
              Kunci Jawaban <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="correct_answer"
              value={form.correct_answer}
              onChange={handleChange}
              required
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onHide} disabled={loading}>
            Batal
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Simpan"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

// MAIN PAGE
const TrainingPage = () => {
  const [activeTab, setActiveTab] = useState("kurikulum");
  const [showCurriculumModal, setShowCurriculumModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);

  const [editCurriculum, setEditCurriculum] = useState(null);
  const [editMaterial, setEditMaterial] = useState(null);
  const [editEvaluation, setEditEvaluation] = useState(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  return (
    <div
      className="p-4"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-dark mb-0">Manajemen Training & Edukasi</h4>
        {activeTab === "kurikulum" && (
          <Button
            variant="primary"
            onClick={() => {
              setEditCurriculum(null);
              setShowCurriculumModal(true);
            }}
            className="fw-medium d-flex align-items-center gap-2 px-3 shadow-sm rounded-3"
          >
            <Plus size={18} weight="bold" /> Tambah Kurikulum
          </Button>
        )}
        {activeTab === "materi" && (
          <Button
            variant="primary"
            onClick={() => {
              setEditMaterial(null);
              setShowMaterialModal(true);
            }}
            className="fw-medium d-flex align-items-center gap-2 px-3 shadow-sm rounded-3"
          >
            <Plus size={18} weight="bold" /> Tambah Materi
          </Button>
        )}
        {activeTab === "evaluasi" && (
          <Button
            variant="primary"
            onClick={() => {
              setEditEvaluation(null);
              setShowEvaluationModal(true);
            }}
            className="fw-medium d-flex align-items-center gap-2 px-3 shadow-sm rounded-3"
          >
            <Plus size={18} weight="bold" /> Tambah Soal Evaluasi
          </Button>
        )}
      </div>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav
          variant="pills"
          className="global-tabs tabs-md flex-nowrap mb-4 bg-white p-1 rounded-4 shadow-sm"
          style={{ width: "fit-content", overflowX: "auto" }}
        >
          <Nav.Item>
            <Nav.Link
              eventKey="kurikulum"
              className="px-4 py-2 rounded-pill fw-medium transition-all"
            >
              Kurikulum
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="materi"
              className="px-4 py-2 rounded-pill fw-medium transition-all"
            >
              Materi
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="evaluasi"
              className="px-4 py-2 rounded-pill fw-medium transition-all"
            >
              Evaluasi & Kuis
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="laporan"
              className="px-4 py-2 rounded-pill fw-medium transition-all"
            >
              Laporan & Ranking
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="kurikulum">
            <CurriculumTab
              key={`curr-${refreshTrigger}`}
              onEdit={(item) => {
                setEditCurriculum(item);
                setShowCurriculumModal(true);
              }}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="materi">
            <MaterialTab
              key={`mat-${refreshTrigger}`}
              onEdit={(item) => {
                setEditMaterial(item);
                setShowMaterialModal(true);
              }}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="evaluasi">
            <EvaluationTab
              key={`eval-${refreshTrigger}`}
              onEdit={(item) => {
                setEditEvaluation(item);
                setShowEvaluationModal(true);
              }}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="laporan">
            <RankingTab key={`rank-${refreshTrigger}`} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      <CurriculumModal
        show={showCurriculumModal}
        onHide={() => setShowCurriculumModal(false)}
        curriculum={editCurriculum}
        onSuccess={() => {
          setShowCurriculumModal(false);
          triggerRefresh();
        }}
      />
      <MaterialModal
        show={showMaterialModal}
        onHide={() => setShowMaterialModal(false)}
        material={editMaterial}
        onSuccess={() => {
          setShowMaterialModal(false);
          triggerRefresh();
        }}
      />
      <EvaluationModal
        show={showEvaluationModal}
        onHide={() => setShowEvaluationModal(false)}
        evaluation={editEvaluation}
        onSuccess={() => {
          setShowEvaluationModal(false);
          triggerRefresh();
        }}
      />
    </div>
  );
};

export default TrainingPage;
