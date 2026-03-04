export async function apiRequest(url, options = {}) {

  const response = await fetch(url, options);

  let data = {};

  try {
    data = await response.json();
  } catch (err) {
    // ignore json parse error
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || "Something went wrong"
    };
  }

  return data;
}