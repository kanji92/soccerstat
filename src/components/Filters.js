import React from "react";

function Filters({ filters, onChange }) {
  return (
    <div className="filters">
      <div className="filter-group">
        <label>С:</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onChange("dateFrom", e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>По:</label>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => onChange("dateTo", e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Статус:</label>
        <select
          value={filters.status}
          onChange={(e) => onChange("status", e.target.value)}
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
  );
}

export default Filters;
