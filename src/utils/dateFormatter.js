// Функция для конвертации UTC даты в локальное время (требование ТЗ)
export const formatUTCDateToLocal = (utcDateString) => {
  if (!utcDateString) return '—';
  
  const date = new Date(utcDateString);
  
  // Форматируем дату в формате ДД.ММ.ГГГГ (требование ТЗ)
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  // Форматируем время в формате ЧЧ:ММ
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return {
    date: `${day}.${month}.${year}`,
    time: `${hours}:${minutes}`,
    full: `${day}.${month}.${year} ${hours}:${minutes}`
  };
};

// Функция для преобразования даты в формат YYYY-MM-DD (для API)
export const formatDateToAPI = (dateObject) => {
  if (!dateObject) return '';
  
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObject.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};