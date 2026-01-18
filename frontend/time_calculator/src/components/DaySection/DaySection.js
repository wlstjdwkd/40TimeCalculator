import React, { useState } from 'react';
import { Modal, Radio, Button } from 'antd';
import TimePicker from 'react-time-picker';
import './DaySection.css';

const TODAY_IMAGE = '/images/today.png';


function DaySection({ imageSrc, startTime, endTime, totalTime, onStartChange, onEndChange, isToday }) {

  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);
  const [selectedLeaveOption, setSelectedLeaveOption] = useState(null);

  const showLeaveModal = () => {
    setIsLeaveModalVisible(true);
  };

  const handleLeaveOk = () => {
    if (selectedLeaveOption === 'full') {
      onStartChange('08:00');
      onEndChange('17:00');
    } else if (selectedLeaveOption === 'morning') {
      onStartChange('08:00');
    } else if (selectedLeaveOption === 'afternoon') {
      onEndChange('17:00');
    }
    
    setIsLeaveModalVisible(false);
    setSelectedLeaveOption(null);
  };

  const handleLeaveCancel = () => {
    setIsLeaveModalVisible(false);
  };

  return (
    <div className={`day-section ${isToday ? 'today' : ''}`}>
      <div className="left-controls">
        {/* 연차 버튼 */}
        <img 
          src="/images/holiday.png" 
          alt="연차" 
          id="leave-icon"
          onClick={showLeaveModal}
        />
      </div>
      {/* 요일 이미지 */}
      <div className="image-container">
        {isToday && (
          <img src={TODAY_IMAGE} alt="today" className="today-overlay" />
        )}
        <img src={imageSrc} alt="day" className="day-image" />

      </div>

      {/* 출근, 퇴근, 근무시간 */}
      <div className="day-section-main">
        <div className="day-section-timepickers">
          {/* 출근 시간 */}
          <div className="time-picker">
            <TimePicker
              onChange={onStartChange}
              value={startTime}
              format="HH:mm"
              clearIcon={null}
              maxDetail="minute"
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
              format="HH:mm"
              clearIcon={null}
              maxDetail="minute"
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
      <Modal
        title="연차 선택"
        visible={isLeaveModalVisible}
        onOk={handleLeaveOk}
        onCancel={handleLeaveCancel}
        okText="확인"
        cancelText="취소"
      >
        <Radio.Group onChange={(e) => setSelectedLeaveOption(e.target.value)} value={selectedLeaveOption}>
          <Radio value="full">하루 연차</Radio>
          <Radio value="morning">오전 반차</Radio>
          <Radio value="afternoon">오후 반차</Radio>
        </Radio.Group>
      </Modal>
    </div>
  );
}

export default DaySection;
