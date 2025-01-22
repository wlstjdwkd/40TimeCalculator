// src/components/DaySection/DaySection.js

import React from 'react';
import TimePicker from 'react-time-picker';
import './DaySection.css'; // 스타일을 별도의 CSS 파일로 관리

function DaySection({ imageSrc, startTime, endTime, totalTime, onStartChange, onEndChange }) {
  return (
    <div className="day-section">
      <img src={imageSrc} alt="day" />
      <div className="day-section-main">
        <div className="day-section-timepickers">
          <TimePicker
            onChange={onStartChange}
            value={startTime}
            format="HH:mm:ss"
            clearIcon={null}
            maxDetail="second"
            disableClock
            aria-label="출근 시간"
            className="time-picker"
          />
          <span className="tilde">~</span>
          <TimePicker
            onChange={onEndChange}
            value={endTime}
            format="HH:mm:ss"
            clearIcon={null}
            maxDetail="second"
            disableClock
            aria-label="퇴근 시간"
            className="time-picker"
          />
        </div>
        <div className="day-section-total">
          {totalTime}
        </div>
      </div>
    </div>
  );
}

export default DaySection;
