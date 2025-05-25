import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate , Link } from 'react-router-dom'

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
        <div className="p-6 max-w-sm m-auto flex flex-col justify-center min-h-screen">
            <h2 className="text-xl font-bold mb-4">Signup</h2>
            <form onSubmit={handleSignup} className="flex flex-col gap-3">
                <input type="text" placeholder="Full Name" className="p-2 border" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder="Email" className="p-2 border" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" className="p-2 border" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <p className="text-red-500">{error}</p>}
                <button className="bg-green-500 text-white p-2">Signup</button>
            </form>
            <p className="mt-4 text-center">
                Already Have Account?{' '}
                <Link to="/" className="text-blue-600 hover:underline">
                    Login
                </Link>
            </p>
        </div>
    )
}
