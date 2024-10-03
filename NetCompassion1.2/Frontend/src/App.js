import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthContext, { AuthProvider } from "./AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import NoPageFound from "./pages/NoPageFound";
import Layout from "./components/Layout";
import Store from "./pages/Store";
import Sales from "./pages/Sales";
import PurchaseDetails from "./pages/PurchaseDetails";
import YouthManagement from "./pages/youth";
import YouthAttendance from "./pages/Attendance";
import AttendanceList from "./pages/AttendanceList";
import BankList from './components/BankList';
import SchoolList from './components/SchoolList';
import StudentList from './components/StudentList';
import MessagingPage from './pages/MessagingPage';
import Teacher from './pages/teacher'
import TeacherAttendance from './pages/teacher_attendancelist'
import Layout_pcd from "./components/Layout_pcd";

const App = () => {
    const [user, setUser] = useState(null);
    const [loader, setLoader] = useState(true);
    
    useEffect(() => {
        const myLoginUser = JSON.parse(localStorage.getItem("user"));
        if (myLoginUser) {
            setUser(myLoginUser);
        }
        setLoader(false);
    }, []);

    const value = { user, signin: setUser, signout: () => { setUser(null); localStorage.removeItem("user"); } };

    if (loader) {
        return (
            <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <h1>LOADING...</h1>
            </div>
        );
    }

    return (
        <AuthProvider>
            <BrowserRouter>
            <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route 
                        path="/" 
                        element={
                            <ProtectedWrapper allowedRoles={['pd', 'pcd', 'teacher', 'burser', 'auditor']}>
                                <Layout_pcd />
                            </ProtectedWrapper>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="inventory" element={<Inventory />} />
                        <Route path="purchase-details" element={<PurchaseDetails />} />
                        <Route path="sales" element={<Sales />} />
                        <Route path="manage-store" element={
                            <ProtectedWrapper allowedRoles={['burser']}>
                                <Store />
                            </ProtectedWrapper>
                        } />
                        <Route path="manage-youth" element={
                            <ProtectedWrapper allowedRoles={['pd', 'pcd', 'teacher']}>
                                <YouthManagement />
                            </ProtectedWrapper>
                        } />
                        <Route path="addattendance" element={
                            <ProtectedWrapper allowedRoles={['pcd']}>
                                <YouthAttendance />
                            </ProtectedWrapper>
                        } />
                        <Route path="attendancelist" element={
                            <ProtectedWrapper allowedRoles={['pcd']}>
                                <AttendanceList />
                            </ProtectedWrapper>
                        } />
                        <Route path="schoolfees" element={
                            <ProtectedWrapper allowedRoles={['burser']}>
                                <BankList />
                            </ProtectedWrapper>
                        } />
                        <Route path="teacher" element={<Teacher />} />
                        <Route path="teacherattendance" element={<TeacherAttendance />} />
                        <Route path="message" element={<MessagingPage />} />
                        <Route path="banks/:bankId" element={<SchoolList />} />
                        <Route path="banks/:bankId/schools/:schoolId" element={<StudentList />} />
                    </Route>
                    <Route path="*" element={<NoPageFound />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
