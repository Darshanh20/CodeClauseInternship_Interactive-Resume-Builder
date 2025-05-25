// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './auth/login'
import Signup from './auth/signup'
import IntroPage from './pages/intropage'
import TemplatePage from './pages/templatepage'
import Form from './components/form'
import TemplateSelectionPage from './pages/templateselectionpage'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/intropage" element={<IntroPage/>}/>
        <Route path="/templateselectionpage" element={<TemplateSelectionPage />} />
        <Route path="/resume" element={<TemplatePage />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </Router>
  )
}

export default App
