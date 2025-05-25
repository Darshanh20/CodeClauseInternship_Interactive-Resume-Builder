import ResumeForm from '../components/form'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'


export default function IntroPage() {
  const navigate = useNavigate()

  const handleNext = () => {
    navigate('/select-template')
  }

  return (
  <div className='bg-gray-900 min-h-screen text-white'>
    <Navbar />
    <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row items-start gap-10">

      {/* Intro Text Section */}
      <div className="md:w-1/2 space-y-5">
        <h1 className="text-5xl font-bold text-white">
          Welcome to <span className="text-blue-500">BRIEF</span>
        </h1>
        <p className="text-lg text-gray-300">
          Build your resume effortlessly with our modern builder.
        </p>
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          <li>Start by filling out your personal, academic, and work details.</li>
          <li>Choose from beautiful and professional templates.</li>
          <li>Edit and download your resume instantly.</li>
        </ul>
        <p className="text-sm text-green-400 font-semibold mt-4">
          Already filled the form? You can directly head to template selection from view template and edit anytime!
        </p>
      </div>

      {/* Form Section */}
      <div className="md:w-1/2 bg-gray-800 p-6 rounded-xl shadow-lg">
        <ResumeForm />
      </div>
    </div>
  </div>
)


}
