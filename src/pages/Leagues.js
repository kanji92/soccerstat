import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getLeagues } from "../services/api";
import Pagination from "../components/Pagination";

function Leagues() {
  const [leagues, setLeagues] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setLoading(true);
        const { competitions, count } = await getLeagues();
        setLeagues(Array.isArray(competitions) ? competitions : []);
        setTotalCount(count || 0);
        setError(null);
      } catch (err) {
        setError("Ошибка при загрузке лиг");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeagues();
  }, []);

  const filteredLeagues = leagues.filter(league =>
    league.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    league.area?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeagues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeagues.length / itemsPerPage);

  if (loading) return <div className="loading">Загрузка лиг...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h1 className="page-title">Футбольные лиги</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск лиг..."
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="search-input"
        />
      </div>

      <div className="leagues-grid">
        {currentItems.map(league => {
          const logo = league.emblem || league.crestUrl || league.emblemUrl;
          const flag = league.area?.flag;

          return (
            <Link key={league.id} to={`/league/${league.id}`} className="league-card">
              <div className="league-info">
                {logo && <img src={logo} alt={league.name} className="league-logo" onError={(e)=>{e.target.style.display='none'}} />}
                <h3>{league.name}</h3>
                <p>{league.area?.name}</p>
                {flag && <img src={flag} alt={league.area?.name} className="country-flag" onError={(e)=>{e.target.style.display='none'}} />}
              </div>
            </Link>
          );
        })}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {filteredLeagues.length === 0 && <div className="no-data">Лиги не найдены</div>}
      <div className="total-count">Всего лиг: {totalCount}</div>
    </div>
  );
}

export default Leagues;
