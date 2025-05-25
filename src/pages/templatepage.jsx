import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { templates } from '../templates'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/navbar'

export default function TemplatePage() {
  const [loading, setLoading] = useState(true)
  const [resume, setResume] = useState(null)
  const [skills, setSkills] = useState([])
  const [education, setEducation] = useState([])
  const [experience, setExperience] = useState([])
  const [certifications, setCertifications] = useState([])
  const [links, setLinks] = useState([])
  const [userEmail, setUserEmail] = useState('')
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const selectedTemplate = queryParams.get('template') || 'template1' // fallback to template1

  useEffect(() => {
    const fetchData = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError || !authData?.user) return

      const userId = authData.user.id

      // Fetch email from 'users' table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single()

      if (userError || !userData) return
      setUserEmail(userData.email)

      // Fetch resume
      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })  // optional: newest resume first
        .limit(1)
        .single()

      if (resumeError || !resumeData) {
        console.error('Resume fetch error:', resumeError)
      }
      setResume(resumeData)

      const resumeId = resumeData.id

      // Fetch all sub-sections
      const [skillsData, educationData, experienceData, certificationsData, linksData] = await Promise.all([
        supabase.from('skills').select('*').eq('resume_id', resumeId),
        supabase.from('education').select('*').eq('resume_id', resumeId),
        supabase.from('experience').select('*').eq('resume_id', resumeId),
        supabase.from('certifications').select('*').eq('resume_id', resumeId),
        supabase.from('links').select('*').eq('resume_id', resumeId)
      ])

      setSkills(skillsData.data || [])
      setEducation(educationData.data || [])
      setExperience(experienceData.data || [])
      setCertifications(certificationsData.data || [])
      setLinks(linksData.data || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading || !resume) return <p>Loading...</p>
  const TemplateComponent = templates[selectedTemplate] || templates['template1']

  return (
    <div>
      <Navbar />
      <TemplateComponent
        resume={{ ...resume, email: userEmail }}
        skills={skills}
        education={education}
        experience={experience}
        certifications={certifications}
        links={links}
      />
    </div>
  )
}
