// assets/js/auth.js

// Fungsi untuk cek apakah user sudah login
function checkAuth() {
  const adminId = localStorage.getItem("saas_admin_id");
  const path = window.location.pathname;

  // Jika di halaman dashboard tapi tidak ada session, lempar ke login
  if (!adminId && path.includes("/dashboard_saas/")) {
    window.location.href = "../login.html";
  }
}

// Fungsi untuk menyimpan session (dipanggil setelah login sukses)
function setSession(data) {
  localStorage.setItem("saas_admin_id", data.admin_id);
  localStorage.setItem("saas_tenant_id", data.tenant_id);
  localStorage.setItem("saas_nama", data.nama);
  localStorage.setItem("saas_nama_toko", data.nama_toko);
  localStorage.setItem("saas_domain_slug", data.domain_slug);
}

// Panggil checkAuth di setiap halaman dashboard
checkAuth();
