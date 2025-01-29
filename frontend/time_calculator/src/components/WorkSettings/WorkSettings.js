// src/components/WorkSettings/WorkSettings.js

import React from 'react';
import TimePicker from 'react-time-picker';
import './WorkSettings.css'; 

function WorkSettings({
  requiredWorkingTime,
  setRequiredWorkingTime,
  coreTimeStart,
  setCoreTimeStart,
  coreTimeEnd,
  setCoreTimeEnd,
  lunchBreakTime,
  setLunchBreakTime,
  togglePopup
}) {
  return (
    <div className="work-settings-overlay">
      <div className="work-settings">
        <h2>설정</h2>
        <div className="work-settings-time-pickers">
          {/* 필수 주간 근무 */}
          <div className="work-settings-row">
            <label htmlFor="requiredWorkingTime" className="work-settings-label">필수 주간 근무</label>
            <div className="time-picker">
                <TimePicker
                    id="requiredWorkingTime"
                    onChange={setRequiredWorkingTime}
                    value={requiredWorkingTime}
                    format="HH:mm"
                    clearIcon={null}
                    maxDetail="minute"
                    disableClock
                />
            </div>
            
          </div>

          {/* 코어타임 시작 */}
          <div className="work-settings-row">
            <label htmlFor="coreTimeStart" className="work-settings-label">코어타임 시작</label>
            <div className="time-picker">
                <TimePicker
                id="coreTimeStart"
                onChange={setCoreTimeStart}
                value={coreTimeStart}
                format="HH:mm"
                clearIcon={null}
                maxDetail="minute"
                disableClock
                />
            </div>
            
          </div>

          {/* 코어타임 종료 */}
          <div className="work-settings-row">
            <label htmlFor="coreTimeEnd" className="work-settings-label">코어타임 종료</label>
            <div className="time-picker">
                <TimePicker
                id="coreTimeEnd"
                onChange={setCoreTimeEnd}
                value={coreTimeEnd}
                format="HH:mm"
                clearIcon={null}
                maxDetail="minute"
                disableClock
                />
            </div>
            
          </div>

          {/* 점심 먹는 시간 */}
          <div className="work-settings-row">
            <label htmlFor="lunchBreakTime" className="work-settings-label">점심 먹는 시간</label>
            <div className="time-picker">
                <TimePicker
                id="lunchBreakTime"
                onChange={setLunchBreakTime}
                value={lunchBreakTime}
                format="HH:mm"
                clearIcon={null}
                maxDetail="minute"
                disableClock
                />
            </div>

            
          </div>
        </div>


        <button
        onClick={togglePopup}
        className="work-settings-close-btn">
          닫기
        </button>
      </div>
    </div>

  );
}

export default WorkSettings;
