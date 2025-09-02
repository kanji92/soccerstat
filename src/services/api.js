import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-Auth-Token': API_KEY,
    'Content-Type': 'application/json',
  },
});

// Перехватчик для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);

    if (error.response?.status === 429) {
      alert('Превышен лимит запросов. Попробуйте позже.');
    } else if (error.response?.status === 403) {
      alert('Ошибка доступа. Проверьте API ключ.');
    } else if (error.response?.status === 404) {
      alert('Данные не найдены.');
    } else {
      alert('Произошла ошибка при загрузке данных.');
    }

    return Promise.reject(error);
  }
);

// ---------- Функции API ---------- //

// Получить список лиг
export const getLeagues = async () => {
  const { data } = await apiClient.get('/competitions');
  return {
    competitions: data.competitions || [],
    count: data.count || 0,
  };
};

// Получить матчи определённой лиги
export const getLeagueMatches = async (leagueId, filters = {}) => {
  const params = {};
  if (filters.dateFrom && filters.dateTo) {
    params.dateFrom = filters.dateFrom;
    params.dateTo = filters.dateTo;
  }
  if (filters.status) {
    params.status = filters.status; // например: SCHEDULED, FINISHED
  }

  const { data } = await apiClient.get(`/competitions/${leagueId}/matches`, { params });
  return {
    matches: data.matches || [],
    count: data.count || 0,
  };
};

// Получить список команд
export const getTeams = async () => {
  const { data } = await apiClient.get('/teams');
  return {
    teams: data.teams || [],
    count: data.count || 0,
  };
};

// Получить данные одной команды
export const getTeam = async (teamId) => {
  const { data } = await apiClient.get(`/teams/${teamId}`);
  return data;
};

// Получить матчи команды
export const getTeamMatches = async (teamId, filters = {}) => {
  const params = {};
  if (filters.dateFrom && filters.dateTo) {
    params.dateFrom = filters.dateFrom;
    params.dateTo = filters.dateTo;
  }
  if (filters.status) {
    params.status = filters.status;
  }

  const { data } = await apiClient.get(`/teams/${teamId}/matches`, { params });
  return {
    matches: data.matches || [],
    count: data.count || 0,
  };
};

export default apiClient;
