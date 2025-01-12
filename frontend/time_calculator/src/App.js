import React, { useState, useEffect } from 'react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import './App.css';

const STORAGE_KEY = 'worktime-calculator-data';

const initialDaysData = [
  { day: '월', startTime: '09:00:00', endTime: '15:00:00', totalTime: '' },
  { day: '화', startTime: '09:00:00', endTime: '15:00:00', totalTime: '' },
  { day: '수', startTime: '09:00:00', endTime: '15:00:00', totalTime: '' },
  { day: '목', startTime: '09:00:00', endTime: '15:00:00', totalTime: '' },
  { day: '금', startTime: '09:00:00', endTime: '15:00:00', totalTime: '' },
];

function App() {
  const [loaded, setLoaded] = useState(false);

  const [requiredWorkingTime, setRequiredWorkingTime] = useState('40:00');
  const [coreTimeStart, setCoreTimeStart] = useState('09:00');
  const [coreTimeEnd, setCoreTimeEnd] = useState('15:00');
  const [lunchBreakTime, setLunchBreakTime] = useState('01:00');
  const [daysData, setDaysData] = useState(initialDaysData);

  const [totalWeekTime, setTotalWeekTime] = useState('');
  const [requiredResult, setRequiredResult] = useState('');

  // localStorage 로딩
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.requiredWorkingTime) setRequiredWorkingTime(parsed.requiredWorkingTime);
        if (parsed.coreTimeStart) setCoreTimeStart(parsed.coreTimeStart);
        if (parsed.coreTimeEnd) setCoreTimeEnd(parsed.coreTimeEnd);
        if (parsed.lunchBreakTime) setLunchBreakTime(parsed.lunchBreakTime);
        if (parsed.daysData) setDaysData(parsed.daysData);
      } catch (e) {
        console.warn('localStorage parse error:', e);
      }
    }
    setLoaded(true);
  }, []);

  // localStorage 저장
  useEffect(() => {
    if (!loaded) return;
    const dataToSave = {
      requiredWorkingTime,
      coreTimeStart,
      coreTimeEnd,
      lunchBreakTime,
      daysData,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [loaded, requiredWorkingTime, coreTimeStart, coreTimeEnd, lunchBreakTime, daysData]);

  const parseTimeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(Number);
    const hh = parts[0] || 0;
    const mm = parts[1] || 0;
    const ss = parts[2] || 0;
    return hh * 3600 + mm * 60 + ss;
  };

  const convertSecondsToReadable = (sec) => {
    const h = Math.floor(sec / 3600);
    const remainder = sec % 3600;
    const m = Math.floor(remainder / 60);
    const s = remainder % 60;

    const hStr = h > 0 ? `${h}시간 ` : '';
    const mStr = m > 0 ? `${m}분 ` : '';
    const sStr = s > 0 ? `${s}초` : '';
    return (hStr + mStr + sStr).trim() || '0초';
  };

  const handleCalculate = () => {
    const coreStartSec = parseTimeToSeconds(coreTimeStart);
    const coreEndSec = parseTimeToSeconds(coreTimeEnd);
    const lunchSec = parseTimeToSeconds(lunchBreakTime);
    const requiredSec = parseTimeToSeconds(requiredWorkingTime);

    let totalSecondsOfWeek = 0;
    let coreTimeViolated = false;

    const newDays = daysData.map((item) => {
      const startSec = parseTimeToSeconds(item.startTime);
      const endSec = parseTimeToSeconds(item.endTime);

      if (startSec > coreStartSec || endSec < coreEndSec) {
        coreTimeViolated = true;
      }

      let diffSec = endSec - startSec;
      if (diffSec < 0) diffSec = 0;

      let workSec = diffSec - lunchSec;
      if (workSec < 0) workSec = 0;

      totalSecondsOfWeek += workSec;
      return { ...item, totalTime: convertSecondsToReadable(workSec) };
    });

    setDaysData(newDays);

    if (coreTimeViolated) {
      setTotalWeekTime('코어타임을 만족하지 못했음음');
      setRequiredResult('');
      return;
    }

    setTotalWeekTime(convertSecondsToReadable(totalSecondsOfWeek));

    const diff = requiredSec - totalSecondsOfWeek;
    if (diff > 0) {
      setRequiredResult(`부족: ${convertSecondsToReadable(diff)}`);
    } else {
      setRequiredResult('충족했습니다!');
    }
  };

  // 스타일: 살짝 왼쪽으로 당기기
  const containerStyle = {
    maxWidth: 600,
    margin: '2rem auto',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontFamily: 'sans-serif',
    textAlign: 'center',
  };


  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // 요소를 가로 방향으로 중앙 정렬
    marginBottom: '1rem',
    width: '100%', // 전체 너비를 사용하여 반응형
  };

  const labelStyle = {
    width: 120,
    fontWeight: 'bold',
    textAlign: 'left',   
    marginRight: 8,
  };

  return (
    <div style={containerStyle}>
      <h1>주간 근무시간 계산기!</h1>

      {/* 필수 주간 근무 */}
      <div style={rowStyle}>
        <label style={labelStyle}>필수 주간 근무</label>
        <div className="timePickerBig">
          <TimePicker
            onChange={setRequiredWorkingTime}
            value={requiredWorkingTime}
            format="HH:mm"
            disableClock
            clearIcon={null}
          />
        </div>
      </div>

      {/* 코어타임 시작/종료 */}
      <div style={rowStyle}>
        <label style={labelStyle}>코어타임 시작</label>
        <div className="timePickerBig">
          <TimePicker
            onChange={setCoreTimeStart}
            value={coreTimeStart}
            format="HH:mm"
            disableClock
            clearIcon={null}
          />
        </div>
      </div>
      <div style={rowStyle}>
        <label style={labelStyle}>코어타임 종료</label>
        <div className="timePickerBig">
          <TimePicker
            onChange={setCoreTimeEnd}
            value={coreTimeEnd}
            format="HH:mm"
            disableClock
            clearIcon={null}
          />
        </div>
      </div>

      {/* 점심시간 */}
      <div style={rowStyle}>
        <label style={labelStyle}>점심시간</label>
        <div className="timePickerBig">
          <TimePicker
            onChange={setLunchBreakTime}
            value={lunchBreakTime}
            format="HH:mm"
            disableClock
            clearIcon={null}
          />
        </div>
      </div>

      <hr />

      {/* 월~금 (시:분:초) */}
      {daysData.map((item, idx) => (
        <div key={item.day} style={{ marginBottom: '1rem' }}>
          <strong>{item.day}요일</strong>
          <div style={{ ...rowStyle, marginBottom: '0.5rem' }}>
            <label style={labelStyle}>출근</label>
            <div className="timePickerBig">
              <TimePicker
                onChange={(val) => {
                  const updated = [...daysData];
                  updated[idx].startTime = val || '';
                  setDaysData(updated);
                }}
                value={item.startTime}
                format="HH:mm:ss"
                maxDetail="second"
                disableClock
                clearIcon={null}
              />
            </div>
          </div>
          <div style={{ ...rowStyle, marginBottom: '0.5rem' }}>
            <label style={labelStyle}>퇴근</label>
            <div className="timePickerBig">
              <TimePicker
                onChange={(val) => {
                  const updated = [...daysData];
                  updated[idx].endTime = val || '';
                  setDaysData(updated);
                }}
                value={item.endTime}
                format="HH:mm:ss"
                maxDetail="second"
                disableClock
                clearIcon={null}
              />
            </div>
          </div>
          <div style={{ ...rowStyle, marginBottom: '0.5rem' }}>
            <label style={labelStyle}>근무시간</label>
            <span>{item.totalTime || '-'}</span>
          </div>
          <hr
            style={{
              border: 'none',
              borderTop: '1px dotted #ccc',
              width: '80%',
              margin: '0.5rem auto',
            }}
          />
        </div>
      ))}

      <button
        onClick={handleCalculate}
        style={{
          width: '100%',
          padding: '0.75rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#4caf50',
          color: '#fff',
          fontSize: '1rem',
        }}
      >
        근무시간 계산
      </button>

      {/* 결과 영역 */}
      {totalWeekTime && (
        <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          {totalWeekTime}
        </div>
      )}
      {requiredResult && (
        <div
          style={{
            marginTop: '1rem',
            fontWeight: 'bold',
            color: requiredResult.startsWith('부족') ? 'red' : 'green',
          }}
        >
          {requiredResult}
        </div>
      )}
    </div>
  );
}

export default App;
