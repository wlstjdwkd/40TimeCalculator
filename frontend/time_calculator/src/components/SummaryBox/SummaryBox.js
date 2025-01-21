// src/components/SummaryBox/SummaryBox.js

import React from 'react';
import './SummaryBox.css';

function SummaryBox({ totalWeekTime, requiredResult }) {
    const isFulfilled = requiredResult === '충족했습니다!';

  return (
    <div className="summary-box">
      <div className="summary-row">
        <span className="summary-label">총 근무시간</span>
        <span className="summary-time">{totalWeekTime}</span>
      </div>
      <div className="summary-row">
        <span className="summary-label">잔여 근무시간</span>
        {isFulfilled ? (
          <span className="summary-time fulfilled">충족했습니다!</span>
        ) : (
          <span className="summary-time remaining">{requiredResult}</span>
        )}
      </div>
    </div>
  );
}

export default SummaryBox;
