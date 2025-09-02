import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeagues } from '../services/api';

function Leagues() {
  const [leagues, setLeagues] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Загрузка данных о лигах
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setLoading(true);
        const { competitions, count } = await getLeagues();
        setLeagues(competitions || []);
        setTotalCount(count || 0);
      } catch (err) {
        setError('Ошибка при загрузке лиг');
        console.error('Error fetching leagues:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  // Фильтрация лиг по поисковому запросу
  const filteredLeagues = leagues.filter(league =>
    league.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    league.area?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Пагинация
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLeagues.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLeagues.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="loading">Загрузка лиг...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page">
      <h1 className="page-title">Футбольные лиги</h1>
      
      {/* Поиск */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск лиг..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Список лиг */}
      <div className="leagues-grid">
        {currentItems.map(league => {
          const logo = league.emblem || league.crestUrl || league.emblemUrl;
          const flag = league.area?.flag;

          return (
            <Link 
              key={league.id} 
              to={`/league/${league.id}`}
              className="league-card"
            >
              <div className="league-info">
                {logo && (
                  <img 
                    src={logo} 
                    alt={league.name}
                    className="league-logo"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <h3>{league.name}</h3>
                <p>{league.area?.name}</p>
                {flag && (
                  <img 
                    src={flag} 
                    alt={league.area?.name}
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

      {filteredLeagues.length === 0 && !loading && (
        <div className="no-data">Лиги не найдены</div>
      )}

      {/* Дополнительно можно показать общее количество */}
      <div className="total-count">
        Всего лиг: {totalCount}
      </div>
    </div>
  );
}

export default Leagues;
