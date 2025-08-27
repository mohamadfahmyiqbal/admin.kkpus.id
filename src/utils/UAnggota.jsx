import http from "./common";

class UAnggota {
  // Helper: kirim request dengan JSON
  postJSON(url, data) {
    return http.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Helper: kirim request dengan FormData
  postFormData(url, data) {
    const formData = new FormData();
    Object.entries(data || {}).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return http.post(url, formData, {
      // Biarkan axios set boundary untuk multipart
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  logout(fields) {
    return this.postJSON("/logout", fields);
  }

  login(fields) {
    return this.postJSON("/login", fields);
  }

  forgot(fields) {
    return this.postJSON("/forgot", fields);
  }

  verifikasiOTP(fields) {
    return this.postJSON("/verifikasiOTP", fields);
  }

  resetPassword(fields) {
    return this.postJSON("/resetPassword", fields);
  }

  register(fields) {
    return this.postJSON("/register", fields);
  }

  getAnggotaCategory(fields) {
    return this.postJSON("/getAnggotaCategory", fields);
  }

  findAnggotaByToken(fields) {
    return this.postJSON("/findAnggotaByToken", fields);
  }

  getDetailAnggotaByToken(fields) {
    return this.postJSON("/getDetailAnggotaByToken", fields);
  }

  anggotaList(fields) {
    return this.postJSON("/anggotaList", fields);
  }

  cekPendaftaranAnggota(fields) {
    return this.postJSON("/cekPendaftaranAnggota", fields);
  }

  daftarAnggota(fields) {
    return this.postFormData("/daftarAnggota", fields);
  }
}

export default new UAnggota();
