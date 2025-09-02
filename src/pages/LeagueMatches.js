import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLeagueMatches } from '../services/api';
import { formatUTCDateToLocal } from '../utils/dateFormatter';
import { getRussianStatus } from '../utils/matchStatuses';
import { renderScore } from '../utils/renderScore';

function LeagueMatches() {
  const { id } = useParams();
  const [matches, setMatches] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: ''
  });

  // Пагинация
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLeagueMatches = async () => {
      if ((filters.dateFrom && !filters.dateTo) || (!filters.dateFrom && filters.dateTo)) {
        return;
      }

      try {
        setLoading(true);
        const { matches, count } = await getLeagueMatches(id, filters);
        setMatches(matches || []);
        setTotalCount(count || 0);
        setError(null);
      } catch (err) {
        setError('Ошибка при загрузке матчей лиги');
        console.error('Error fetching league matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueMatches();
  }, [id, filters]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  // Пагинация
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = matches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(matches.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 5);
    let endPage = Math.min(totalPages, startPage + 9);

    if (endPage - startPage < 9) {
      startPage = Math.max(1, endPage - 9);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Цвет индикаторов
  const getIndicatorColor = (match, teamType) => {
    const homeScore = match.score.fullTime?.home ?? 0;
    const awayScore = match.score.fullTime?.away ?? 0;

    if (homeScore === awayScore) return "#ccc";

    if (teamType === "HOME_TEAM") {
      return homeScore > awayScore ? "green" : "red";
    } else {
      return awayScore > homeScore ? "green" : "red";
    }
  };

  if (loading) return <div className="loading">Загрузка матчей...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <nav className="breadcrumbs">
        <Link to="/">Лиги</Link>
        <span> → </span>
        <span>Матчи лиги</span>
      </nav>

      <h1 className="page-title">Матчи лиги</h1>

      <div className="filters">
        <div className="filter-group">
          <label>С:</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>По:</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Статус:</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Все</option>
            <option value="SCHEDULED">Запланированные</option>
            <option value="LIVE">В процессе</option>
            <option value="FINISHED">Завершённые</option>
            <option value="POSTPONED">Перенесённые</option>
            <option value="CANCELED">Отменённые</option>
          </select>
        </div>
      </div>

      <div className="matches-list">
        {currentItems.map(match => {
          const formattedDate = formatUTCDateToLocal(match.utcDate);
          const isFinished = match.status === "FINISHED";

          return (
            <div key={match.id} className="match-card">
              <div className="match-date">
                {formattedDate.date} {formattedDate.time}
              </div>
              <div className="match-status">
                {getRussianStatus(match.status)}
              </div>
              
              <div className="match-teams">
                <div className="team-container">
                  {match.homeTeam.crest && (
                    <img
                      src={match.homeTeam.crest}
                      alt={match.homeTeam.name}
                      className="team-small-logo"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <span className="team home-team">{match.homeTeam.name}</span>
                </div>

                {/* vs с индикаторами только для сыгранных матчей */}
                <div className="vs-indicators">
                  {isFinished && (
                    <span
                      className="team-indicator"
                      style={{ backgroundColor: getIndicatorColor(match, "HOME_TEAM") }}
                    ></span>
                  )}
                  <span className="vs">vs</span>
                  {isFinished && (
                    <span
                      className="team-indicator"
                      style={{ backgroundColor: getIndicatorColor(match, "AWAY_TEAM") }}
                    ></span>
                  )}
                </div>

                <div className="team-container">
                  {match.awayTeam.crest && (
                    <img
                      src={match.awayTeam.crest}
                      alt={match.awayTeam.name}
                      className="team-small-logo"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <span className="team away-team">{match.awayTeam.name}</span>
                </div>
              </div>

              {renderScore(match.score, match.status)}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Назад
          </button>

          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}

          <button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Вперед
          </button>
        </div>
      )}

      {matches.length === 0 && !loading && (
        <div className="no-data">Матчи не найдены</div>
      )}

      <div className="total-count">
        Всего матчей: {totalCount}
      </div>
    </div>
  );
}

export default LeagueMatches;
