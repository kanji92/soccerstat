import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTeams } from "../services/api";
import Pagination from "../components/Pagination";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const { teams: apiTeams, count } = await getTeams();
        setTeams(Array.isArray(apiTeams) ? apiTeams : []);
        setTotalCount(count || 0);
        setError(null);
      } catch (err) {
        setError("Ошибка при загрузке команд");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(team =>
    team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.area?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTeams.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);

  if (loading) return <div className="loading">Загрузка команд...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h1 className="page-title">Футбольные команды</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск команд..."
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="search-input"
        />
      </div>

      <div className="teams-grid">
        {currentItems.map(team => {
          const logo = team.crest || team.crestUrl || team.emblemUrl;
          const flag = team.area?.flag;

          return (
            <Link key={team.id} to={`/team/${team.id}`} className="team-card">
              <div className="team-info">
                {logo && <img src={logo} alt={team.name} className="team-logo" onError={(e)=>{e.target.style.display='none'}} />}
                <h3>{team.name}</h3>
                <p>{team.area?.name}</p>
                {team.founded && <p>Основан: {team.founded}</p>}
                {flag && <img src={flag} alt={team.area?.name} className="country-flag" onError={(e)=>{e.target.style.display='none'}} />}
              </div>
            </Link>
          );
        })}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {filteredTeams.length === 0 && <div className="no-data">Команды не найдены</div>}
      <div className="total-count">Всего команд: {totalCount}</div>
    </div>
  );
}

export default Teams;
