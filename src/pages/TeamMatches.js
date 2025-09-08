import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getTeamMatches, getTeam } from "../services/api";
import { formatUTCDateToLocal } from "../utils/dateFormatter";
import { getRussianStatus } from "../utils/matchStatuses";
import { renderScore } from "../utils/renderScore";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";

function TeamMatches() {
  const { id } = useParams();
  const [matches, setMatches] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ dateFrom: "", dateTo: "", status: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTeamData = async () => {
      if ((filters.dateFrom && !filters.dateTo) || (!filters.dateFrom && filters.dateTo)) return;

      try {
        setLoading(true);
        const teamData = await getTeam(id);
        setTeam(teamData);

        const { matches: apiMatches, count } = await getTeamMatches(id, filters);
        setMatches(Array.isArray(apiMatches) ? apiMatches : []);
        setTotalCount(count || 0);
        setError(null);
      } catch (err) {
        setError("Ошибка при загрузке данных команды");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamData();
  }, [id, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMatches = Array.isArray(matches) ? matches.slice(indexOfFirstItem, indexOfLastItem) : [];
  const totalPages = Math.ceil(matches.length / itemsPerPage);

  if (loading) return <div className="loading">Загрузка данных команды...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <nav className="breadcrumbs">
        <Link to="/teams">Команды</Link> <span> → </span> <span>{team?.name || "Команда"}</span>
      </nav>

      <h1 className="page-title">Матчи команды</h1>

      {team && (
        <div className="team-header">
          {(team.crest || team.crestUrl) && <img src={team.crest || team.crestUrl} alt={team.name} className="team-header-logo" onError={(e)=>{e.target.style.display='none'}} />}
          <div className="team-info">
            <h2>{team.name}</h2>
            <p>Страна: {team.area?.name}</p>
            {team.founded && <p>Основан: {team.founded} году</p>}
            {team.venue && <p>Стадион: {team.venue}</p>}
          </div>
        </div>
      )}

      {/* Фильтры */}
      <Filters filters={filters} onChange={handleFilterChange} />

      <div className="matches-list">
        {currentMatches.map(match => {
          const formattedDate = formatUTCDateToLocal(match.utcDate);
          return (
            <div key={match.id} className="match-card">
              <div className="match-date">{formattedDate.date} {formattedDate.time}</div>
              <div className="match-status">{getRussianStatus(match.status)}</div>

              <div className="match-teams">
                <div className="team-container">
                  {match.homeTeam.crest && <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="team-small-logo" onError={(e)=>{e.target.style.display='none'}} />}
                  <span className="team home-team">{match.homeTeam.name}</span>
                </div>

                <span className="vs">vs</span>

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

export default TeamMatches;
