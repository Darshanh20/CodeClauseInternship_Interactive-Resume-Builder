import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useNavigate, useLocation } from 'react-router-dom'


export default function Form() {
  const [userId, setUserId] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    summary: '',
  })
  const [skills, setSkills] = useState([''])
  const [education, setEducation] = useState([{ institution: '', from: '', to: '' }])
  const [experience, setExperience] = useState([{ company: '', role: '', from: '', to: '' }])
  const [certifications, setCertifications] = useState([''])
  const [links, setLinks] = useState([{ label: '', url: '' }])
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const resumeId = queryParams.get('resumeId')
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        setUserEmail(user.email)
      }
    }
    const fetchResumeData = async () => {
      if (!resumeId) return
      const { data: resume } = await supabase.from('resumes').select('*').eq('id', resumeId).single()
      if (resume) {
        setFormData({
          full_name: resume.full_name || '',
          phone: resume.phone || '',
          summary: resume.summary || '',
        })

        const [skills, education, experience, certifications, links] = await Promise.all([
          supabase.from('skills').select('*').eq('resume_id', resumeId),
          supabase.from('education').select('*').eq('resume_id', resumeId),
          supabase.from('experience').select('*').eq('resume_id', resumeId),
          supabase.from('certifications').select('*').eq('resume_id', resumeId),
          supabase.from('links').select('*').eq('resume_id', resumeId),
        ])

        if (skills.data) setSkills(skills.data.map(s => s.name))
        if (education.data) setEducation(education.data.map(ed => ({
          institution: ed.institution,
          from: ed.from_date,
          to: ed.to_date
        })))
        if (experience.data) setExperience(experience.data.map(exp => ({
          company: exp.company,
          role: exp.role,
          from: exp.from_date,
          to: exp.to_date,
          description: exp.description,
          currentlyWorking: exp.currently_working
        })))
        if (certifications.data) setCertifications(certifications.data.map(c => c.title))
        if (links.data) setLinks(links.data.map(l => ({ label: l.label, url: l.url })))
      }
    }
    fetchUser()
    fetchResumeData()

  }, [resumeId])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let resumeData = {
      user_id: userId,
      ...formData
    }

    let resume
    let resumeError

    if (resumeId) {
      const { error } = await supabase.from('resumes').update(resumeData).eq('id', resumeId)
      resume = { id: resumeId }
      resumeError = error

      // Clear old entries before inserting new ones
      await Promise.all([
        supabase.from('skills').delete().eq('resume_id', resumeId),
        supabase.from('education').delete().eq('resume_id', resumeId),
        supabase.from('experience').delete().eq('resume_id', resumeId),
        supabase.from('certifications').delete().eq('resume_id', resumeId),
        supabase.from('links').delete().eq('resume_id', resumeId),
      ])
    } else {
      const { data, error } = await supabase.from('resumes').insert([resumeData]).select().single()
      resume = data
      resumeError = error
    }

    if (resumeError) return alert('Error saving resume: ' + resumeError.message)

    const resumeIdFinal = resume.id

    await Promise.all([
      ...skills.map(skill => supabase.from('skills').insert([{ resume_id: resumeIdFinal, name: skill }])),
      ...education.map(ed => supabase.from('education').insert([{ resume_id: resumeIdFinal, institution: ed.institution, from_date: ed.from, to_date: ed.to }])),
      ...experience.map(exp =>
        supabase.from('experience').insert([{
          resume_id: resumeIdFinal,
          company: exp.company,
          role: exp.role,
          from_date: exp.from,
          to_date: exp.currentlyWorking ? null : exp.to,
          description: exp.description,
          currently_working: exp.currentlyWorking || false
        }])
      ),
      ...certifications.map(cert => supabase.from('certifications').insert([{ resume_id: resumeIdFinal, title: cert }])),
      ...links.map(link => supabase.from('links').insert([{ resume_id: resumeIdFinal, label: link.label, url: link.url }]))
    ])

    alert(resumeId ? 'Resume updated successfully!' : 'Resume saved successfully!')
    navigate('/templateselectionpage')
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div className="bg-gray-100 p-2 text-black">{userEmail}</div>
      <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleFormChange} className="border p-2 w-full" />
      <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleFormChange} className="border p-2 w-full" />
      <textarea name="summary" placeholder="Professional Summary(max 250 words)" value={formData.summary} onChange={handleFormChange} className="border p-2 w-full" maxLength={1800} />

      {/* Skills */}
      <div>
        <label className="font-semibold">Skills</label>
        {skills.map((skill, idx) => (
          <input key={idx} value={skill} onChange={e => {
            const newSkills = [...skills]; newSkills[idx] = e.target.value; setSkills(newSkills)
          }} placeholder="Skill" className="border p-2 w-full my-1" />
        ))}
        <button type="button" onClick={() => setSkills([...skills, ''])} className="text-blue-600 text-sm">+ Add Skill</button>
      </div>

      {/* Education */}
      <div>
        <label className="font-semibold">Education</label>
        {education.map((ed, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-2 my-1">
            <input placeholder="Institution" value={ed.institution} onChange={e => {
              const newEd = [...education]; newEd[idx].institution = e.target.value; setEducation(newEd)
            }} className="border p-2" />
            <input type="date" value={ed.from} onChange={e => {
              const newEd = [...education]; newEd[idx].from = e.target.value; setEducation(newEd)
            }} className="border p-2" />
            <input type="date" value={ed.to} onChange={e => {
              const newEd = [...education]; newEd[idx].to = e.target.value; setEducation(newEd)
            }} className="border p-2" />
          </div>
        ))}
        <button type="button" onClick={() => setEducation([...education, { institution: '', from: '', to: '' }])} className="text-blue-600 text-sm">+ Add Education</button>
      </div>

      {/* Experience */}
      <div>
        <label className="font-semibold">Experience</label>
        {experience.map((exp, idx) => (
          <div key={idx} className="border p-2 my-2 rounded">
            <input
              placeholder="Company"
              value={exp.company}
              onChange={e => {
                const newExp = [...experience]
                newExp[idx].company = e.target.value
                setExperience(newExp)
              }}
              className="border p-2 w-full my-1"
            />

            <input
              placeholder="Role"
              value={exp.role}
              onChange={e => {
                const newExp = [...experience]
                newExp[idx].role = e.target.value
                setExperience(newExp)
              }}
              className="border p-2 w-full my-1"
            />

            <textarea
              placeholder="Work Summary / Description (max 100 words)"
              value={exp.description || ''}
              onChange={e => {
                const newExp = [...experience]
                newExp[idx].description = e.target.value
                setExperience(newExp)
              }}
              className="border p-2 w-full my-1"
              maxLength={700}
            />

            <div className="grid grid-cols-2 gap-2 my-1">
              <input
                type="date"
                value={exp.from}
                onChange={e => {
                  const newExp = [...experience]
                  newExp[idx].from = e.target.value
                  setExperience(newExp)
                }}
                className="border p-2"
              />
              {!exp.currentlyWorking && (
                <input
                  type="date"
                  value={exp.to}
                  onChange={e => {
                    const newExp = [...experience]
                    newExp[idx].to = e.target.value
                    setExperience(newExp)
                  }}
                  className="border p-2"
                />
              )}
            </div>

            <label className="text-sm flex items-center gap-2">
              <input
                type="checkbox"
                checked={exp.currentlyWorking || false}
                onChange={e => {
                  const newExp = [...experience]
                  newExp[idx].currentlyWorking = e.target.checked
                  if (e.target.checked) newExp[idx].to = '' // clear end date if currently working
                  setExperience(newExp)
                }}
              />
              Currently Working
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setExperience([...experience, {
              company: '', role: '', from: '', to: '', description: '', currentlyWorking: false
            }])
          }
          className="text-blue-600 text-sm mt-2"
        >
          + Add Experience
        </button>
      </div>


      {/* Certifications */}
      <div>
        <label className="font-semibold">Certifications</label>
        {certifications.map((cert, idx) => (
          <input key={idx} value={cert} onChange={e => {
            const newCert = [...certifications]; newCert[idx] = e.target.value; setCertifications(newCert)
          }} placeholder="Certification" className="border p-2 w-full my-1" />
        ))}
        <button type="button" onClick={() => setCertifications([...certifications, ''])} className="text-blue-600 text-sm">+ Add Certification</button>
      </div>

      {/* Links */}
      <div>
        <label className="font-semibold">Links</label>
        {links.map((link, idx) => (
          <div key={idx} className="grid grid-cols-2 gap-2 my-1">
            <input placeholder="Label (e.g. GitHub)" value={link.label} onChange={e => {
              const newLinks = [...links]; newLinks[idx].label = e.target.value; setLinks(newLinks)
            }} className="border p-2" />
            <input placeholder="URL" value={link.url} onChange={e => {
              const newLinks = [...links]; newLinks[idx].url = e.target.value; setLinks(newLinks)
            }} className="border p-2" />
          </div>
        ))}
        <button type="button" onClick={() => setLinks([...links, { label: '', url: '' }])} className="text-blue-600 text-sm">+ Add Link</button>
      </div>

      <button type="submit" className='cursor-pointer w-full bg-blue-500 hover:bg-blue-600 p-2 rounded-2xl text-white transition'>Save Resume</button>
    </form>
  )
}
