// === KONFIGURASI GLOBAL ===
const GAS_API_URL = "URL_GAS_WEB_APP_ANDA_DISINI";

document.addEventListener("DOMContentLoaded", () => {
  loadComponents();
});

// === 1. FUNGSI PEMUAT KOMPONEN HTML ===
async function loadComponents() {
  try {
    // Cek kedalaman folder untuk menyesuaikan path fetch()
    // Jika file HTML ada di dalam folder (misal: tenant_app/index.html), path-nya '../components/'
    const pathPrefix =
      window.location.pathname.includes("/tenant_app/") ||
      window.location.pathname.includes("/dashboard_saas/")
        ? "../"
        : "";

    const headerContainer = document.getElementById("header-container");
    const sidebarContainer = document.getElementById("sidebar-container");
    const footerContainer = document.getElementById("footer-container");

    if (headerContainer) {
      const headRes = await fetch(pathPrefix + "components/header.html");
      headerContainer.innerHTML = await headRes.text();
    }

    if (sidebarContainer) {
      const sideRes = await fetch(pathPrefix + "components/sidebar.html");
      sidebarContainer.innerHTML = await sideRes.text();
    }

    if (footerContainer) {
      const footRes = await fetch(pathPrefix + "components/footer.html");
      footerContainer.innerHTML = await footRes.text();
      initFooter(); // Panggil setter tahun & nama toko
    }

    // Eksekusi logika UI khusus Sidebar & Header jika komponennya ada
    if (sidebarContainer || headerContainer) {
      setActiveMenu();
      populateUserData();
      calculateShift();
      fetchBadges();
    }
  } catch (error) {
    console.error("Gagal memuat komponen HTML:", error);
  }
}

// === 2. LOGIKA MENU AKTIF (PENGGANTI PHP is_active) ===
function setActiveMenu() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".sidebar-menu-container a.nav-link");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("active");

      // Jika ini sub-menu, buka folder parent-nya (Treeview)
      const treeviewParent = link.closest(".has-treeview");
      if (treeviewParent) {
        treeviewParent.classList.add("menu-open");
        treeviewParent.querySelector("a.nav-link").classList.add("active");
      }
    }
  });
}

// === 3. LOGIKA PROFIL ADMIN ===
function populateUserData() {
  const namaAdmin = localStorage.getItem("tenant_admin_nama") || "Admin Kasir";

  const nameEl = document.getElementById("sidebar-name");
  if (nameEl) nameEl.textContent = namaAdmin;

  const initialsEl = document.getElementById("sidebar-initials");
  if (initialsEl) {
    const parts = namaAdmin.split(" ");
    let init = "";
    parts.forEach((p) => {
      if (init.length < 2) init += p.charAt(0).toUpperCase();
    });
    initialsEl.textContent = init || "AD";
  }

  const sideYear = document.getElementById("sidebar-year");
  if (sideYear) sideYear.textContent = new Date().getFullYear();
}

// === 4. LOGIKA WAKTU SHIFT (PENGGANTI PHP DATE) ===
function calculateShift() {
  const hour = new Date().getHours();
  let shiftName = "Shift Off";

  if (hour >= 8 && hour < 16) {
    shiftName = "Shift 1";
  } else if (hour >= 16 && hour < 22) {
    shiftName = "Shift 2";
  }

  const topShift = document.getElementById("nav-shift-display");
  const sideShiftTime = document.getElementById("sidebar-shift-time");

  if (topShift) topShift.textContent = shiftName;
  if (sideShiftTime)
    sideShiftTime.textContent =
      shiftName === "Shift 1"
        ? "08:00 - 16:00"
        : shiftName === "Shift 2"
          ? "16:00 - 22:00"
          : "Off Duty";
}

// === 5. FETCH BADGE NOTIFIKASI ===
async function fetchBadges() {
  const adminId = localStorage.getItem("tenant_admin_id");
  if (!adminId || GAS_API_URL === "URL_GAS_WEB_APP_ANDA_DISINI") return;

  try {
    const response = await fetch(
      `${GAS_API_URL}?action=get_badges&admin_id=${adminId}`,
    );
    const result = await response.json();

    if (result.status === "success") {
      const badgeBooked = document.getElementById("badge-booked");
      const badgeOut = document.getElementById("badge-out");

      if (result.data.booked_count > 0 && badgeBooked) {
        badgeBooked.textContent = result.data.booked_count;
        badgeBooked.style.display = "inline-block";
      }
      if (result.data.out_count > 0 && badgeOut) {
        badgeOut.textContent = result.data.out_count;
        badgeOut.style.display = "inline-block";
      }
    }
  } catch (error) {
    console.error("Gagal menarik data badge:", error);
  }
}

// === 6. SET TAHUN FOOTER OTOMATIS ===
function initFooter() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const tokoNameEl = document.getElementById("footer-toko-name");
  const namaToko = localStorage.getItem("saas_nama_toko") || "SewaTendaku";
  if (tokoNameEl) tokoNameEl.textContent = namaToko;
}

// === 7. FUNGSI LOGOUT DENGAN SWEETALERT ===
function handleLogout(e) {
  if (e) e.preventDefault();

  // Fallback jika SweetAlert belum ter-load di halaman
  if (typeof Swal === "undefined") {
    if (confirm("Yakin ingin keluar?")) executeLogout();
    return;
  }

  Swal.fire({
    title: "Yakin Ingin Keluar?",
    text: "Sesi Anda akan berakhir dan Anda harus login kembali.",
    icon: "warning",
    showCancelButton: true,
    reverseButtons: true,
    buttonsStyling: false,
    confirmButtonText: '<i class="fa-solid fa-check"></i>',
    cancelButtonText: '<i class="fa-solid fa-xmark"></i>',
    customClass: {
      confirmButton:
        "bg-transparent border-none shadow-none text-green-500 text-5xl px-6 py-2 cursor-pointer hover:scale-125 transition-transform focus:outline-none",
      cancelButton:
        "bg-transparent border-none shadow-none text-red-500 text-5xl px-6 py-2 cursor-pointer hover:scale-125 transition-transform focus:outline-none",
    },
  }).then((result) => {
    if (result.isConfirmed) executeLogout();
  });
}

function executeLogout() {
  // Hapus data sesi di LocalStorage
  localStorage.clear();
  // Arahkan ke halaman login di root
  window.location.href = "../login.html";
}
