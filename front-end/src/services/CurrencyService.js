const axios = require("axios");

/**
 * Uses exchangerate.host (no API key) for simplicity.
 * Example: getRate("USD","PKR") -> number
 */
async function getRate(from = "USD", to = "USD") {
  if (from === to) return 1;
  const url = `https://api.exchangerate.host/latest?base=${encodeURIComponent(from)}&symbols=${encodeURIComponent(to)}`;
  const { data } = await axios.get(url, { timeout: 8000 });
  return data?.rates?.[to] || 1;
}

module.exports = { getRate };