// assets/js/api.js

const GAS_API_URL = "URL_GAS_WEB_APP_ANDA_DISINI";

async function postData(action, payload) {
  // Tambahkan action ke payload
  payload.action = action;

  const response = await fetch(GAS_API_URL, {
    method: "POST",
    mode: "no-cors", // Penting untuk GAS agar tidak kena CORS error
    body: JSON.stringify(payload),
  });

  // Karena no-cors, kita biasanya mengandalkan response status saja
  // Atau jika Anda setting web app GAS menjadi "allow all", hapus mode: 'no-cors'
  return await response.json();
}

async function getData(action, params = {}) {
  let url = new URL(GAS_API_URL);
  url.searchParams.append("action", action);

  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key]),
  );

  const response = await fetch(url);
  return await response.json();
}
