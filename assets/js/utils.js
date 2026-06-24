// assets/js/utils.js

// Format Rupiah
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
}

// Notifikasi simpel (bisa diganti SweetAlert)
function showToast(message, type = "success") {
  console.log(`${type.toUpperCase()}: ${message}`);
  // Nanti bisa integrasi dengan Toastify atau SweetAlert di sini
}
