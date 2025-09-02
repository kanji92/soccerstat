import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTeams } from '../services/api';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Загрузка данных о командах
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const { teams, count } = await getTeams();
        setTeams(teams || []);
        setTotalCount(count || 0);
      } catch (err) {
        setError('Ошибка при загрузке команд');
        console.error('Error fetching teams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Фильтрация команд по поисковому запросу
  const filteredTeams = teams.filter(team =>
    team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.area?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Пагинация
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTeams.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="loading">Загрузка команд...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h1 className="page-title">Футбольные команды</h1>
      
      {/* Поиск */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск команд..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Список команд */}
      <div className="teams-grid">
        {currentItems.map(team => {
          const logo = team.crest || team.crestUrl || team.emblemUrl;
          const flag = team.area?.flag;

          return (
            <Link 
              key={team.id} 
              to={`/team/${team.id}`}
              className="team-card"
            >
              <div className="team-info">
                {logo && (
                  <img 
                    src={logo} 
                    alt={team.name}
                    className="team-logo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <h3>{team.name}</h3>
                <p>{team.area?.name}</p>
                {team.founded && <p>Основан: {team.founded}</p>}
                {flag && (
                  <img 
                    src={flag} 
                    alt={team.area?.name}
                    className="country-flag"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Пагинация */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Назад
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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

      {filteredTeams.length === 0 && !loading && (
        <div className="no-data">Команды не найдены</div>
      )}

      {/* Дополнительно можно показать общее количество */}
      <div className="total-count">
        Всего команд: {totalCount}
      </div>
    </div>
  );
}

export default Teams;
