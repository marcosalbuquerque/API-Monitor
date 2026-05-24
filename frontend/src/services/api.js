import axios from 'axios';

const BASE_URL = '/api';

/**
 * Busca a lista de APIs do catálogo
 */
export async function getApis() {
  const response = await axios.get(`${BASE_URL}/apis`);
  return response.data;
}

/**
 * Dispara um health check para uma API específica
 * @param {string} id - ID da API
 */
export async function probeApi(id) {
  const response = await axios.post(`${BASE_URL}/probe/${id}`);
  return response.data;
}

/**
 * Busca o histórico de métricas da sessão
 */
export async function getMetrics() {
  const response = await axios.get(`${BASE_URL}/metrics`);
  return response.data;
}
