import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import Intro from './components/Intro'
import Layout from './components/Layout'
import { Toaster } from './components/ui'
import { DemoProvider } from './demo/Demo'
import { useSmoothScroll } from './motion/motion'
import AddWork from './pages/AddWork'
import { CallsPage, NewCall } from './pages/Calls'
import Discover from './pages/Discover'
import Feed from './pages/Feed'
import ImportPage from './pages/Import'
import Messages from './pages/Messages'
import { NewOpportunity, OpportunitiesPage } from './pages/Opportunities'
import Profile from './pages/Profile'
import { Shortlists, Talent } from './pages/Talent'
import Welcome from './pages/Welcome'
import WorkPage from './pages/WorkPage'
import { AppProvider, useApp } from './state/AppContext'

function Home() {
  const { me, data } = useApp()
  if (data.signedUp[me.id] === false) return <Navigate to="/welcome" replace />
  if (me.role === 'provider') return <Navigate to="/talent" replace />
  return <Feed />
}

function AppRoutes() {
  useSmoothScroll()
  // The logo intro plays once per browser session.
  const [intro, setIntro] = useState(() => {
    try { return !sessionStorage.getItem('hypha-intro') } catch { return true }
  })
  return (
    <>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/import/:source" element={<ImportPage />} />
        <Route path="/work/:id" element={<WorkPage />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="me" element={<Profile />} />
          <Route path="add-work" element={<AddWork />} />
          <Route path="calls" element={<CallsPage />} />
          <Route path="calls/new" element={<NewCall />} />
          <Route path="opportunities" element={<OpportunitiesPage />} />
          <Route path="opportunities/new" element={<NewOpportunity />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:id" element={<Messages />} />
          <Route path="talent" element={<Talent />} />
          <Route path="shortlists" element={<Shortlists />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster />
      {intro && (
        <Intro
          onDone={() => {
            try { sessionStorage.setItem('hypha-intro', '1') } catch { /* ignore */ }
            setIntro(false)
          }}
        />
      )}
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <DemoProvider>
          <AppRoutes />
        </DemoProvider>
      </BrowserRouter>
    </AppProvider>
  )
}
