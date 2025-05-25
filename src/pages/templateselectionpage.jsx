import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase' 
import T1 from '../assets/T1.png';
import T2 from '../assets/T2.png';
import T3 from '../assets/T3.png';
import Navbar from '../components/navbar';

export default function TemplateSelectionPage() {
  const navigate = useNavigate()

  const selectTemplate = async (templateName) => {
    // Get current user
    const { data: authData, error: authError } = await supabase.auth.getUser()
    if (authError || !authData?.user) {
      alert('Please login first to select a template.')
      return
    }

    const userId = authData.user.id

    // Check if resume exists for this user
    const { data: resumeData, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .limit(1)
      .single()

    if (resumeError || !resumeData) {
      alert('You have no resume data yet. Please fill out your resume from the start before selecting a template.')
      return
    }

    // If resume exists, navigate with the template
    navigate(`/resume?template=${templateName}`)
  }

  return (
    <div>
      <Navbar/>
      <div className='flex flex-col justify-center gap-10 bg-gray-900 min-h-screen'>
        <h1 className='text-center text-5xl font-serif text-[rgb(143,180,238)]'>Templates</h1>
        <div className='flex justify-center gap-12 flex-wrap'>
          <div className='text-center flex flex-col gap-4'>
            <img src={T1} alt="" className="w-100 h-auto" />
            <div>
            <button onClick={() => selectTemplate('template1')} className='cursor-pointer bg-blue-500 hover:bg-blue-600 p-2 rounded-2xl text-white transition'>Template 1</button>
            </div>
          </div>
          <div className='text-center flex flex-col gap-4'>
            <img src={T2} alt="" className='w-100 h-auto' />
            <div>
            <button onClick={() => selectTemplate('template2')} className='cursor-pointer bg-blue-500 hover:bg-blue-600 p-2 rounded-2xl text-white transition'>Template 2</button>
            </div>
          </div>
          <div className='text-center flex flex-col gap-4'>
            <img src={T3} alt="image" className='w-100 h-auto' />
            <div>
            <button onClick={() => selectTemplate('template3')} className='cursor-pointer bg-blue-500 hover:bg-blue-600 p-2 rounded-2xl text-white transition'>Template 3</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
