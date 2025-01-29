// src/components/DaySection/DaySection.js

import React from 'react';
import TimePicker from 'react-time-picker';
import './DaySection.css'; // 스타일을 별도의 CSS 파일로 관리

function DaySection({ imageSrc, startTime, endTime, totalTime, onStartChange, onEndChange }) {
  return (
    <div className="day-section">
      {/* 요일 이미지 */}
      <img src={imageSrc} alt="day" />

      {/* 출근, 퇴근, 근무시간 */}
      <div className="day-section-main">
        <div className="day-section-timepickers">
          {/* 출근 시간 */}
          <div className="time-picker">
            <TimePicker
              onChange={onStartChange}
              value={startTime}
              format="HH:mm:ss"
              clearIcon={null}
              maxDetail="second"
              disableClock
              aria-label="출근 시간"
            />            
          </div>


          {/* ~ 기호 */}
          <div className="tilde">~</div>

          <div className="time-picker">
            {/* 퇴근 시간 */}
            <TimePicker
              onChange={onEndChange}
              value={endTime}
              format="HH:mm:ss"
              clearIcon={null}
              maxDetail="second"
              disableClock
              aria-label="퇴근 시간"
            />
          </div>
        </div>

        {/* 근무 시간 */}
        <div className="day-section-total">
          {totalTime}
        </div>
      </div>
    </div>
  );
}

export default DaySection;
