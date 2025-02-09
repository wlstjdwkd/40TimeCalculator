import React, { useState, useEffect, useMemo } from 'react';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import './App.css';
import DaySection from './components/DaySection/DaySection';
import SummaryBox from './components/SummaryBox/SummaryBox';
import WorkSettings from './components/WorkSettings/WorkSettings';
import Footer from './components/Footer/Footer';

const STORAGE_KEY = 'worktime-calculator-data';

const dayImages = {
  '월': '/images/mon.png',
  '화': '/images/tue.png',
  '수': '/images/wed.png',
  '목': '/images/thu.png',
  '금': '/images/fri.png',
};

const initialDaysData = [
  { day: '월', startTime: '09:00:00', endTime: '15:00:00' },
  { day: '화', startTime: '09:00:00', endTime: '15:00:00' },
  { day: '수', startTime: '09:00:00', endTime: '15:00:00' },
  { day: '목', startTime: '09:00:00', endTime: '15:00:00' },
  { day: '금', startTime: '09:00:00', endTime: '15:00:00' },
];

const backgroundImage = "/images/background.png";

function App() {
  const [loaded, setLoaded] = useState(false);

  const [requiredWorkingTime, setRequiredWorkingTime] = useState('40:00');
  const [coreTimeStart, setCoreTimeStart] = useState('09:00');
  const [coreTimeEnd, setCoreTimeEnd] = useState('15:00');
  const [lunchBreakTime, setLunchBreakTime] = useState('01:00');
  const [daysData, setDaysData] = useState(initialDaysData);

  const [requiredResult, setRequiredResult] = useState('');

  /* 시간 설정 팝업*/
  const [isPopupOpen, setIsPopupOpen] = useState(false);
	const togglePopup = () => setIsPopupOpen((prev) => !prev);


  //화면 새로 들어갈 때마다 새로고침하는 로직
  useEffect(() => {
    // visibilitychange 이벤트 핸들러 정의
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        window.location.reload();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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

		// 항상 두 자리로 포맷
		const hStr = String(h).padStart(2, "0") + "시간 ";
		const mStr = String(m).padStart(2, "0") + "분 ";
		const sStr = String(s).padStart(2, "0") + "초";

		return hStr + mStr + sStr;
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

      let workSec = diffSec - lunchSec - 1;
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
      setRequiredResult(`${convertSecondsToReadable(diff)}`);
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
      const timeParts = value.split(':');
      if (timeParts.length === 2) {
        updated[idx][field] = `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}:00`;
      } else {
        updated[idx][field] = value;
      }
    }
    setDaysData(updated);
  };

  //초기화 핸들러 함수
  const handleReset = () => {
    setDaysData(initialDaysData);
  };

  const containerStyle = {
    maxWidth: 600,
    margin: '2rem auto',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: 8,
    fontFamily: 'sans-serif',
    textAlign: 'center',
  };

  // 오늘 요일 구하기 (월~금)
  const todayIndex = new Date().getDay(); 
  // 월~금에 해당하는 값: 1~5
  const todayLabel = (todayIndex >= 1 && todayIndex <= 5) 
    ? ['월', '화', '수', '목', '금'][todayIndex - 1]
    : null;

  return (
    <div style={containerStyle}>
      <div className="background" style={{backgroundImage: 'url('+backgroundImage+')'}}>
        <h1 className="title">
          <img src ='/images/logo.png' width="100rem"></img>
        </h1>

      </div>
      {/* 결과 영역 */}
      <SummaryBox totalWeekTime={totalWeekTime} requiredResult={requiredResult} />


      {/* 월~금 (시:분:초) */}
      {daysData.map((item, idx) => (
        <DaySection 
          key={item.day}
          imageSrc={dayImages[item.day]}
          startTime={item.startTime}
          endTime={item.endTime}
          totalTime={perDayTotalTime[idx]}
          onStartChange={(val) => handleDayTimeChange(idx, 'startTime', val)}
          onEndChange={(val) => handleDayTimeChange(idx, 'endTime', val)}
          isToday={item.day === todayLabel}  // 현재 요일이면 true 전달
        />
      ))}


      <button
				onClick={togglePopup}
				className="settingBtn"
			>
				설정
			</button>
      <button onClick={handleReset} className="resetBtn">
        초기화
      </button>

      {/* WorkSettings 컴포넌트 */}
			{isPopupOpen && (
          <WorkSettings
          requiredWorkingTime={requiredWorkingTime}
          setRequiredWorkingTime={setRequiredWorkingTime}
          coreTimeStart={coreTimeStart}
          setCoreTimeStart={setCoreTimeStart}
          coreTimeEnd={coreTimeEnd}
          setCoreTimeEnd={setCoreTimeEnd}
          lunchBreakTime={lunchBreakTime}
          setLunchBreakTime={setLunchBreakTime}
          togglePopup={togglePopup}
        />)
      }

      {/* 푸터 */}
      <Footer />
    </div>
  );
}

export default App;
