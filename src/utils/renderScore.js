import React from 'react';

export function renderScore(score, status) {
  if (!score) {
    if (status === 'SCHEDULED' || status === 'TIMED') {
      return <div className="match-time">Матч не начался</div>;
    }
    if (status === 'LIVE' || status === 'IN_PLAY' || status === 'PAUSED') {
      return <div className="match-live">В процессе</div>;
    }
    return <div className="match-no-score">Нет данных о счёте</div>;
  }

  const fullTimeHome = score.fullTime?.homeTeam;
  const fullTimeAway = score.fullTime?.awayTeam;
  const extraTimeHome = score.extraTime?.homeTeam;
  const extraTimeAway = score.extraTime?.awayTeam;
  const penaltiesHome = score.penalties?.homeTeam;
  const penaltiesAway = score.penalties?.awayTeam;

  const hasFullTime = fullTimeHome !== null && fullTimeHome !== undefined &&
                      fullTimeAway !== null && fullTimeAway !== undefined;
  const hasExtraTime = extraTimeHome !== null && extraTimeHome !== undefined &&
                       extraTimeAway !== null && extraTimeAway !== undefined;
  const hasPenalties = penaltiesHome !== null && penaltiesHome !== undefined &&
                       penaltiesAway !== null && penaltiesAway !== undefined;

  if (!hasFullTime && !hasExtraTime && !hasPenalties) {
    if (status === 'FINISHED') {
      return <div className="match-no-score">Данные не доступны по тарифу</div>;
    }
    return <div className="match-no-score">Нет данных</div>;
  }

  return (
    <div className="match-score-detailed">
      {hasFullTime && (
        <span className="score-main">
          {fullTimeHome}:{fullTimeAway}
        </span>
      )}
      {hasExtraTime && (
        <span className="score-extra">
          ({extraTimeHome}:{extraTimeAway})
        </span>
      )}
      {hasPenalties && (
        <span className="score-penalties">
          ({penaltiesHome}:{penaltiesAway})
        </span>
      )}
    </div>
  );
}
