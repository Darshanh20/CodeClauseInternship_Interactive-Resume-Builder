import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { UserCircle, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
    const [userEmail, setUserEmail] = useState('')
    const [fullName, setFullName] = useState('')
    const navigate = useNavigate()

    const handleViewTemplates = () => {
        navigate('/templateselectionpage')
    }
    const handleTitleClick = () => {
        navigate('/intropage')
    }
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (!error) {
            navigate('/')
        } else {
            alert('Logout failed.')
            console.error(error)
        }
    }
    useEffect(() => {
        const fetchUserData = async () => {
            const { data, error } = await supabase.auth.getUser()
            if (error || !data?.user) return

            const userId = data.user.id

            // Fetch email and full_name from users table
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('email, full_name')
                .eq('id', userId)
                .single()

            if (!userError && userData) {
                setUserEmail(userData.email)
                setFullName(userData.full_name)
            }
        }

        fetchUserData()
    }, [])

    return (
        <div className="p-4 flex justify-between items-center bg-gray-900 shadow-md border-gray-800">
            <div className="flex flex-col text-left cursor-pointer" onClick={handleTitleClick}
                title="Go to Intro Page">
                <div className="text-2xl md:text-4xl font-sans font-bold text-[rgb(59,130,246)]">BRIEF</div>
                <div className="text-sm md:text-base text-[rgb(143,180,238)]">The Ultimate Resume Builder</div>
            </div>
            <div>
                <button
                    className="font-semibold p-2 m-2 rounded-2xl cursor-pointer hover:bg-gray-200 hover:text-black transition text-[rgb(59,130,246)]"
                    onClick={handleViewTemplates} title='View Different Templates'
                >
                    View Templates
                </button>
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-[rgb(59,130,246)] text-xl md:text-2xl">{fullName || 'Guest User'}</span>
                <button
                    onClick={handleLogout}
                    className="text-sm text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    title="Logout"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </div>
        </div>
    )
}
