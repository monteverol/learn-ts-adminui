import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Main from "./components/layout/Main"
import Users from "./pages/Users"
import Home from "./pages/Home"
import Tables from "./pages/Tables"
import Billing from "./pages/Billing"
import Profile from "./pages/Profile"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Rtl from "./pages/Rtl"
import UserProfile from './pages/UserProfile'
import JobCategories from './pages/JobCategories'
import Services from './pages/Services'

function App(): React.JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/*" element={
            <Main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Home />} />
                <Route path="/tables" element={<Tables />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/rtl" element={<Rtl />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserProfile />} />
                <Route path="/services" element={<Services />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/job-category" element={<JobCategories />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Main>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
