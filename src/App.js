import './assets/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ISRegisterPage from './pages/ISRegisterPage';
import MainPage from './pages/MainPage';
import React, { useState } from 'react';
import Header from './components/navigator/Header';
import ViewAllAttendance from './pages/attendance/ViewAllAttendance';
import PostAttendance from './pages/attendance/PostAttendance';

function App() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({});

    const handleCancel = () => {
        setFormData({});
        setStep(0);
    };

    const handleBack = (navigate) => {
        if (step > 0 && step < 5) {
            setStep(step - 1);
        } else if (step === 0) {
            navigate('/');
        }
    };

    const nextStep = (newData) => {
        setFormData({ ...formData, ...newData });
        setStep(step + 1);
    };

    return (
        <Router>
            <div className="mainContainer">
                <Header
                    onBack={handleBack}
                    onCancel={handleCancel}
                    step={step}
                />
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route
                        path="/ISRegister"
                        element={
                            <ISRegisterPage
                                step={step}
                                nextStep={nextStep}
                                prevStep={handleBack}
                                formData={formData}
                            />
                        }
                    />
                    <Route
                        path="/attendance/main"
                        element={<ViewAllAttendance />}
                    />
                    <Route
                        path="/attendance/post"
                        element={<PostAttendance />} // 글쓰기 페이지 컴포넌트 대체 필요
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
