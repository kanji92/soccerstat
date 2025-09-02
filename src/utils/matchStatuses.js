// Маппинг статусов матча с английского на русский (требование ТЗ)
export const matchStatuses = {
  SCHEDULED: 'Запланирован',
  LIVE: 'В прямом эфире',
  IN_PLAY: 'В игре',
  PAUSED: 'Пауза',
  FINISHED: 'Завершен',
  POSTPONED: 'Отложен',
  SUSPENDED: 'Приостановлен',
  CANCELED: 'Отменен',
};

// Функция для получения русского статуса
export const getRussianStatus = (status) => {
  return matchStatuses[status] || status;
};