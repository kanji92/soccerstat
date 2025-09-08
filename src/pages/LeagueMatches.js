import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getLeagueMatches } from "../services/api";
import { formatUTCDateToLocal } from "../utils/dateFormatter";
import { getRussianStatus } from "../utils/matchStatuses";
import { renderScore } from "../utils/renderScore";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";

function LeagueMatches() {
  const { id } = useParams();
  const [matches, setMatches] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ dateFrom: "", dateTo: "", status: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLeagueMatches = async () => {
      if ((filters.dateFrom && !filters.dateTo) || (!filters.dateFrom && filters.dateTo)) return;

      try {
        setLoading(true);
        const { matches: apiMatches, count } = await getLeagueMatches(id, filters);
        setMatches(Array.isArray(apiMatches) ? apiMatches : []);
        setTotalCount(count || 0);
        setError(null);
      } catch (err) {
        setError("Ошибка при загрузке матчей лиги");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeagueMatches();
  }, [id, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(matches) ? matches.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil(matches.length / itemsPerPage);

  const getIndicatorColor = (match, teamType) => {
    const homeScore = match.score.fullTime?.home ?? 0;
    const awayScore = match.score.fullTime?.away ?? 0;
    if (homeScore === awayScore) return "#ccc";
    return teamType === "HOME_TEAM" ? (homeScore > awayScore ? "green" : "red") : (awayScore > homeScore ? "green" : "red");
  };

  if (loading) return <div className="loading">Загрузка матчей...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <nav className="breadcrumbs">
        <Link to="/">Лиги</Link> <span> → </span> <span>Матчи лиги</span>
      </nav>

      <h1 className="page-title">Матчи лиги</h1>

      {/* Фильтры */}
      <Filters filters={filters} onChange={handleFilterChange} />

      <div className="matches-list">
        {currentItems.map((match) => {
          const formattedDate = formatUTCDateToLocal(match.utcDate);
          const isFinished = match.status === "FINISHED";

          return (
            <div key={match.id} className="match-card">
              <div className="match-date">{formattedDate.date} {formattedDate.time}</div>
              <div className="match-status">{getRussianStatus(match.status)}</div>

              <div className="match-teams">
                <div className="team-container">
                  {match.homeTeam.crest && <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="team-small-logo" onError={(e)=>{e.target.style.display='none'}} />}
                  <span className="team home-team">{match.homeTeam.name}</span>
                </div>

                <div className="vs-indicators">
                  {isFinished && <span className="team-indicator" style={{backgroundColor:getIndicatorColor(match,"HOME_TEAM")}}></span>}
                  <span className="vs">vs</span>
                  {isFinished && <span className="team-indicator" style={{backgroundColor:getIndicatorColor(match,"AWAY_TEAM")}}></span>}
                </div>

                <div className="team-container">
                  {match.awayTeam.crest && <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="team-small-logo" onError={(e)=>{e.target.style.display='none'}} />}
                  <span className="team away-team">{match.awayTeam.name}</span>
                </div>
              </div>

              {renderScore(match.score, match.status)}
            </div>
          );
        })}
      </div>

      {/* Пагинация */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {matches.length === 0 && <div className="no-data">Матчи не найдены</div>}
      <div className="total-count">Всего матчей: {totalCount}</div>
    </div>
  );
}

export default LeagueMatches;
