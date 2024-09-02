import React, { useState, useEffect } from 'react';
import '../../assets/attendancePage/ViewAllAttendance.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AttendanceView from '../../components/attendance/AttendanceView';

function ViewAllAttendance() {
    const [totalAttendanceDays, setTotalAttendanceDays] = useState(0); // 총 출석 일자
    const [currentDate, setCurrentDate] = useState(new Date()); // 달력 호출을 위한 현재 날짜, 기본: 오늘
    const [attendanceData, setAttendanceData] = useState([]); // 출석한 날짜 및 출석글 타입, 총 출석 일자를 계산하기 때문에 전체 데이터를 한번에 호출
    const [todayAttendance, setTodayAttendance] = useState(false); // 오늘 출석 여부

    const [selectedAttendance, setSelectedAttendance] = useState(null); // 작성한 글

    // 작성 글 리스트
    const getPostList = () => {
        axios
            .get('http://localhost:9070/attendance/view', {
                withCredentials: true,
            })
            .then((response) => {
                // 출석한 날짜 설정
                setAttendanceData(response.data);

                // 총 출석 일자 설정
                if (response.data.length > 0) {
                    setTotalAttendanceDays(response.data.length);
                } else {
                    setTotalAttendanceDays(0);
                }

                // 오늘 날짜와 일치하는 출석 정보가 있는지 확인
                const today = new Date().toISOString().split('T')[0];
                const hasAttendedToday = response.data.some(
                    (item) => item.date === today,
                );
                setTodayAttendance(hasAttendedToday);
            })

            .catch((error) => {
                console.error('Error in viewAllattendance Page with:', error);
            });
    };

    useEffect(() => {
        getPostList();
    }, []);

    // 날짜를 클릭할 시
    const viewAttendancePosts = (attendanceInfo) => {
        setSelectedAttendance(attendanceInfo);
    };

    // 달력 생성을 위한 함수
    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
    ).getDate();
    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
    ).getDay();

    // 달력 생성
    const renderCalendar = () => {
        let days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(
                <div key={`empty-${i}`} className="calendar-day empty"></div>,
            );
        }
        for (let i = 1; i <= daysInMonth; i++) {
            // 한 자리 숫자일 경우 01, 02와 같이 표현되게 formatting
            const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const attendanceInfo = attendanceData.find(
                (item) => item.date === dateString,
            );

            let attendanceClass = '';
            if (attendanceInfo) {
                attendanceClass =
                    attendanceInfo.type === 'saving'
                        ? 'attend saving'
                        : 'attend overspending';
            }
            days.push(
                // 날짜 출력, 출석을 이미 했다면 스탬프 출력
                <div
                    key={i}
                    className={`calendar-day ${attendanceClass}`}
                    onClick={
                        attendanceInfo
                            ? () => viewAttendancePosts(attendanceInfo)
                            : null
                    }
                >
                    <span>{i}</span>
                </div>,
            );
        }
        return days;
    };

    // 달력 몇 주 있는지
    const getCalendarRows = () => {
        const totalDays = firstDayOfMonth + daysInMonth;
        return Math.ceil(totalDays / 7);
    };

    // 화살표 클릭 시 몇 월인지 변경
    const changeMonth = (increment) => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(
                prevDate.getFullYear(),
                prevDate.getMonth() + increment,
                1,
            );
            return newDate;
        });
    };

    // 당일 출석을 이미 했을 시 클릭 방지
    const handleAttendanceClick = (event) => {
        if (todayAttendance) {
            event.preventDefault();
            alert('오늘은 이미 출석했습니다.');
        }
    };

    return (
        <div className="ViewAllAttendance">
            <br />
            <br />
            <main>
                <section className="attendance-summary">
                    <h2>
                        오늘까지 <span>{totalAttendanceDays}</span>일 출석했어요
                    </h2>
                </section>

                <section className="calendar-container">
                    <div className="calendar-navigation">
                        <button onClick={() => changeMonth(-1)}>&lt;</button>
                        <h3>
                            {currentDate.getFullYear()}.{' '}
                            {String(currentDate.getMonth() + 1).padStart(
                                2,
                                '0',
                            )}
                        </h3>
                        <button onClick={() => changeMonth(1)}>&gt;</button>
                    </div>
                    <div className={`calendar rows-${getCalendarRows()}`}>
                        <div className="calendar-header">
                            <div>일</div>
                            <div>월</div>
                            <div>화</div>
                            <div>수</div>
                            <div>목</div>
                            <div>금</div>
                            <div>토</div>
                        </div>
                        <div className="calendar-body">{renderCalendar()}</div>
                    </div>
                </section>
            </main>

            {selectedAttendance && (
                <AttendanceView
                    attendanceInfo={selectedAttendance}
                    onClose={() => setSelectedAttendance(null)}
                />
            )}

            <Link
                to="http://localhost:3000/attendance/post"
                className={`attendance-button ${
                    todayAttendance ? 'disabled' : ''
                }`}
                onClick={handleAttendanceClick}
            >
                오늘 출석체크하기
            </Link>

            <div className="attendance-info">
                · 하루에 한 번 오늘 날짜만 출석할 수 있어요.
            </div>
        </div>
    );
}

export default ViewAllAttendance;
