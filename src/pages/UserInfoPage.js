import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/friendPage/UserInfoPage.css';
import Container from '../components/common/Container';
import AddFriendsModal from '../components/friends/AddFriendsModal'; // Modal 컴포넌트를 import
import axios from 'axios';

import flexBird from '../assets/attendancePage/img/flexBird.png';
import poorBird from '../assets/attendancePage/img/poorBird.png';

import goldBird from '../assets/common/img/goldBird.png';
import speechBubble from '../assets/common/img/speechBubble.png';

const UserInfoPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    const [userData, setUserData] = useState(null); // userData를 상태로 관리

    const quote_flex = '나는 부목눈이!';
    const quote_poor = '나는 거목눈이...';

    useEffect(() => {
        fetchUserID();
    }, []); // 의존성 배열을 추가하여 첫 번째 렌더링에서만 호출

    const fetchUserID = async () => {
        try {
            const res = await axios.get('http://localhost:9070/api/user/info', {
                withCredentials: true, // 쿠키 포함
            });

            // res.data의 내용을 기반으로 새로운 객체 생성
            const updatedUserData = {
                ...res.data, // 기존 데이터 유지
                profileImg:
                    res.data.userAttendanceCnt >= 30 ? flexBird : poorBird, // 조건에 따른 이미지 설정
                profileQuote:
                    res.data.userAttendanceCnt >= 30 ? quote_flex : quote_poor, // 조건에 따른 문구 설정
                rank: 'GOLD', // 새로운 rank 추가
            };

            setUserData(updatedUserData); // 상태로 userData 업데이트
        } catch (err) {
            console.error('Failed to fetch user ID', err);
        }
    };

    const goToFollowing = () => {
        navigate('/friend'); // '/following' 경로로 이동
    };

    const goToFollowers = () => {
        navigate('/friend'); // '/followers' 경로로 이동
    };

    const openModal = () => {
        setIsModalOpen(true); // 모달 열기
    };

    const closeModal = () => {
        setIsModalOpen(false); // 모달 닫기
    };

    // userData가 로드되기 전 로딩 상태 처리
    if (!userData) {
        return <div>Loading...</div>; // userData가 없을 때 로딩 메시지 표시
    }

    return (
        <Container
            style={{
                backgroundColor: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
            }}
        >
            <br />
            <br />
            <div className="profile-section">
                <p className="profile-quote">{userData.profileQuote}</p>
                <img
                    src={userData.profileImg}
                    alt="Profile"
                    className="profile-image"
                />
            </div>
            <div className="user-info">
                <h2 className="user-name">{userData.userName}</h2>
                <p className="user-id">@{userData.userCode}</p>
                <div className="follow-info">
                    <div className="following" onClick={goToFollowing}>
                        <span className="follow-count">
                            {userData.userFollowing}
                        </span>
                        <span>Following</span>
                    </div>
                    <div className="followers" onClick={goToFollowers}>
                        <span className="follow-count">
                            {userData.userFollower}
                        </span>
                        <span>Followers</span>
                    </div>
                </div>
                <div className="btn-div">
                    <button className="add-friends-btn" onClick={openModal}>
                        + ADD FRIENDS
                    </button>
                </div>
            </div>
            <div className="attendance-section">
                <h2 className="attendance-top">
                    현재까지...{' '}
                    <span className="attendance-days">
                        {userData.userAttendanceCnt}일
                    </span>{' '}
                    출석하셨습니다.
                </h2>
                <p className="attendance-link">
                    {userData.userName}님의 이번 달 출석 현황 보러가기 →
                </p>
            </div>
            <div className="ranking-section">
                <h2>Ranking</h2>
                <div className="rank-info">
                    <div className="rank-images">
                        <img
                            src={goldBird}
                            className="rank-mark"
                            alt="gold bird"
                        />
                        <div className="speech-container">
                            <img
                                src={speechBubble}
                                className="speech-bubble"
                                alt="speech bubble"
                            />
                            <span className="speech-text">
                                나 골드됐다 짱이지
                            </span>
                        </div>
                    </div>
                    <div className="rank-description">
                        {userData.userName}님은 현재 {userData.rank} 리그입니다!
                    </div>
                </div>
            </div>
            {/* 모달 컴포넌트 */}
            <AddFriendsModal isOpen={isModalOpen} onClose={closeModal} />
        </Container>
    );
};

export default UserInfoPage;