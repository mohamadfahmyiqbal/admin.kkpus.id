import http from '../utils/common';

export default new (class UArisan {
 getLaporanArisanGabungan(fields) {
  return http.post(
   '/getLaporanArisanGabungan',
   fields,
   {
    headers: {
     'Content-Type': 'application/json'
    }
   }
  );
 }
 getAllBatch(fields) {
  return http.post('/getAllBatch', fields, {
   headers: {
    'Content-Type': 'application/json'
   }
  });
 }
})();
