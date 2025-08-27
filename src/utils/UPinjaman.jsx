import http from "./common";

export default new (class UPinjaman {
  setPengampunan(fields) {
    return http.post("/setPengampunan", fields, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  setMasterPinjaman(fields) {
    return http.post("/setMasterPinjaman", fields, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  getSaldoMasterPinjaman(fields) {
    return http.post("/getSaldoMasterPinjaman", fields, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  getAnggotaPinjamanLunak(fields) {
    return http.post("/getAnggotaPinjamanLunak", fields, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  getSetoranPinjaman(fields) {
    return http.post("/getSetoranPinjaman", fields, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  getMasterPinjamanLunak(fields) {
    console.log(fields);

    return http.post("/getMasterPinjamanLunak", fields, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  getLaporanPinjamanLunak(fields) {
    return http.post("/getLaporanPinjamanLunak", fields, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  getJurnalPinjamanLunak(fields) {
    return http.post("/getJurnalPinjamanLunak", fields, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  getNeracaPinjamanLunak(fields) {
    return http.post("/getNeracaPinjamanLunak", fields, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  getMasterPinjamanLunak(fields) {
    return http.post("/getMasterPinjamanLunak", fields, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
})();
