import React from 'react';
import TimePicker from 'react-time-picker';


function DaySection({ imageSrc, startTime, endTime, totalTime, onStartChange, onEndChange }) {
    return (
        <div style={{ marginBottom: '1rem', width: '100%', display: 'flex', alignItems: 'center' }}>

            {/* 요일 이미지 */}
            <img 
            src={imageSrc} 
            alt="요일 이미지" 
            style={{ width: 60, height: 60}} 
            />
    
            {/* 출근, 퇴근, 근무시간 */}
            <div style={{ flex: 1 }}>
                {/* 출근 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', width: '80%' }}>
                    <label style={{ width: 40, fontWeight: 'bold', textAlign: 'left'}}>출근</label>
                    <div className="timePickerBig">
                    <TimePicker
                        onChange={onStartChange}
                        value={startTime}
                        format="HH:mm:ss"
                        clearIcon={null}
                        maxDetail="minute"
                        disableClock
                    />
                    </div>
                </div>
        
                {/* 퇴근 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', width: '80%' }}>
                    <label style={{ width: 40, fontWeight: 'bold', textAlign: 'left'}}>퇴근</label>
                    <div className="timePickerBig">
                    <TimePicker
                        onChange={onEndChange}
                        value={endTime}
                        format="HH:mm:ss"
                        clearIcon={null}
                        maxDetail="minute"
                        disableClock
                    />
                    </div>
                </div>
        
                {/* 근무시간 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', width: '80%' }}>
                    <label style={{ width: 80, fontWeight: 'bold', textAlign: 'left'}}>근무시간</label>
                    <span style={{ fontSize: '1rem' }}>{totalTime || '-'}</span>
                </div>
        
                <hr style={{ border: 'none', borderTop: '1px dotted #ccc', width: '100%', margin: '0.5rem auto' }} />
            </div>
      </div>
    );
  }
  
  export default DaySection;