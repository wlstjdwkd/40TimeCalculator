import React, { useState, useEffect, useMemo } from 'react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import './App.css';

const STORAGE_KEY = 'worktime-calculator-data';

const initialDaysData = [
  { day: '월', startTime: '09:00:00', endTime: '15:00:00' },
  { day: '화', startTime: '09:00:00', endTime: '15:00:00' },
  { day: '수', startTime: '09:00:00', endTime: '15:00:00' },
  { day: '목', startTime: '09:00:00', endTime: '15:00:00' },
  { day: '금', startTime: '09:00:00', endTime: '15:00:00' },
];

function App() {
  const [loaded, setLoaded] = useState(false);

  const [requiredWorkingTime, setRequiredWorkingTime] = useState('40:00');
  const [coreTimeStart, setCoreTimeStart] = useState('09:00');
  const [coreTimeEnd, setCoreTimeEnd] = useState('15:00');
  const [lunchBreakTime, setLunchBreakTime] = useState('01:00');
  const [daysData, setDaysData] = useState(initialDaysData);

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

  // 근무 시간 계산
  const { perDayTotalTime, totalWeekTime, totalSecondsOfWeek, coreTimeViolated } = useMemo(() => {
    const coreStartSec = parseTimeToSeconds(coreTimeStart);
    const coreEndSec = parseTimeToSeconds(coreTimeEnd);
    const lunchSec = parseTimeToSeconds(lunchBreakTime);

    let totalSeconds = 0;
    let coreViolation = false;

    const perDay = daysData.map((item) => {
      const startSec = parseTimeToSeconds(item.startTime);
      const endSec = parseTimeToSeconds(item.endTime);

      if (startSec > coreStartSec || endSec < coreEndSec) {
        coreViolation = true;
      }

      let diffSec = endSec - startSec;
      if (diffSec < 0) diffSec = 0;

      let workSec = diffSec - lunchSec;
      if (workSec < 0) workSec = 0;

      totalSeconds += workSec;
      return workSec;
    });

    return {
      perDayTotalTime: perDay.map(sec => convertSecondsToReadable(sec)),
      totalWeekTime: convertSecondsToReadable(totalSeconds),
      totalSecondsOfWeek: totalSeconds,
      coreTimeViolated: coreViolation,
    };
  }, [coreTimeStart, coreTimeEnd, lunchBreakTime, daysData]);

  // 필수 근무 시간 결과 계산
  useEffect(() => {
    const requiredSec = parseTimeToSeconds(requiredWorkingTime);
    const totalSec = totalSecondsOfWeek;

    if (coreTimeViolated) {
      setRequiredResult('코어타임을 만족하지 못했습니다.');
      return;
    }

    const diff = requiredSec - totalSec;
    if (diff > 0) {
      setRequiredResult(`부족: ${convertSecondsToReadable(diff)}`);
    } else {
      setRequiredResult('충족했습니다!');
    }
  }, [requiredWorkingTime, totalSecondsOfWeek, coreTimeViolated]);

  // 시간 변경 시 요일별 근무시간 업데이트
  const handleDayTimeChange = (idx, field, value) => {
    const updated = [...daysData];
    // TimePicker가 선택한 값이 없을 경우 기본값 설정
    if (!value) {
      updated[idx][field] = field === 'startTime' ? '09:00:00' : '15:00:00';
    } else {
      // TimePicker는 'HH:mm' 또는 'HH:mm:ss' 형식을 반환할 수 있습니다.
      // 항상 'HH:mm:ss' 형식으로 저장
      const timeParts = value.split(':');
      if (timeParts.length === 2) {
        updated[idx][field] = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
      } else {
        updated[idx][field] = value;
      }
    }
    setDaysData(updated);
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
      <h1>주간 근무시간 계산기</h1>

      {/* 필수 주간 근무 */}
      <div style={rowStyle}>
        <label style={labelStyle}>필수 주간 근무</label>
        <div className="timePickerBig">
          <TimePicker
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
      <div style={rowStyle}>
        <label style={labelStyle}>코어타임 시작</label>
        <div className="timePickerBig">
          <TimePicker
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
      <div style={rowStyle}>
        <label style={labelStyle}>코어타임 종료</label>
        <div className="timePickerBig">
          <TimePicker
            onChange={setCoreTimeEnd}
            value={coreTimeEnd}
            format="HH:mm"
            clearIcon={null}
            maxDetail="minute"
            disableClock
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
            clearIcon={null}
            maxDetail="minute"
            disableClock
          />
        </div>
      </div>

      <hr />

      {/* 월~금 (시:분:초) */}
      {daysData.map((item, idx) => (
        <div key={item.day} style={{ marginBottom: '1rem', width: '100%' }}>
          <strong>{item.day}요일</strong>
          <div style={{ ...rowStyle, marginBottom: '0.5rem' }}>
            <label style={labelStyle}>출근</label>
            <div className="timePickerBig">
              <TimePicker
                onChange={(val) => handleDayTimeChange(idx, 'startTime', val)}
                value={item.startTime.slice(0,5)}
                format="HH:mm:ss"
                clearIcon={null}
                maxDetail="second"
                disableClock
              />
            </div>
          </div>
          <div style={{ ...rowStyle, marginBottom: '0.5rem' }}>
            <label style={labelStyle}>퇴근</label>
            <div className="timePickerBig">
              <TimePicker
                onChange={(val) => handleDayTimeChange(idx, 'endTime', val)}
                value={item.endTime.slice(0,5)}
                format="HH:mm:ss"
                clearIcon={null}
                maxDetail="second"
                disableClock
              />
            </div>
          </div>
          <div style={{ ...rowStyle, marginBottom: '0.5rem' }}>
            <label style={labelStyle}>근무시간</label>
            <span>{perDayTotalTime[idx] || '-'}</span>
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

      {/* 결과 영역 */}
      {totalWeekTime && (
        <div style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          총 근무시간: {totalWeekTime}
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
