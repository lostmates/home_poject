import React from 'react';

const PeriodSelector = ({ selectedPeriod, onPeriodChange }) => {
  const periods = [
    { value: 'day', label: 'День' },
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' }
  ];

  const selectedPeriodLabel = periods.find(p => p.value === selectedPeriod)?.label || 'День';

  return (
    <div className="period-selector">
      <div className="dropdown">
        <button className="dropdown-button">
          {selectedPeriodLabel}
          <span className="dropdown-arrow">▼</span>
        </button>
        <div className="dropdown-content">
          {periods.map((period) => (
            <button
              key={period.value}
              className={`dropdown-item ${selectedPeriod === period.value ? 'active' : ''}`}
              onClick={() => onPeriodChange(period.value)}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeriodSelector;
