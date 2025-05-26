import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()

        const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
        if (signUpError) return setError(signUpError.message)

        const userId = data.user.id
        await supabase.from('users').insert([{ id: userId, email, full_name: name }])
        navigate('/intropage')
    }

    return (
        <div className='bg-gray-900 text-white'>
            <div className="p-4 flex justify-between items-center bg-gray-900 shadow-md border-gray-800">
                <div className="flex flex-col items-center text-left cursor-pointer">
                    <div className="text-4xl font-sans font-bold text-[rgb(59,130,246)]">BRIEF</div>
                    <div className="text-base text-[rgb(143,180,238)]">The Ultimate Resume Builder</div>
                </div>
            </div>
            <div className="p-6 max-w-sm m-auto flex flex-col justify-center min-h-screen">
                <h2 className="text-xl font-bold mb-4">Signup</h2>
                <form onSubmit={handleSignup} className="flex flex-col gap-3">
                    <input type="text" placeholder="Full Name" className="p-2 border" value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="email" placeholder="Email" className="p-2 border" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" className="p-2 border" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <p className="text-red-500">{error}</p>}
                    <button className="bg-blue-500 hover:bg-blue-600 transition text-white p-2 cursor-pointer">Signup</button>
                </form>
                <p className="mt-4 text-center">
                    Already Have Account?{' '}
                    <Link to="/" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}
