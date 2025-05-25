import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate ,Link } from 'react-router-dom'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(error.message)
        else navigate('/intropage')
    }

    return (
        <div className="p-6 max-w-sm m-auto flex flex-col justify-center min-h-screen">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <input type="email" placeholder="Email" className="p-2 border" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" className="p-2 border" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <p className="text-red-500">{error}</p>}
                <button className="bg-blue-500 text-white p-2">Login</button>
            </form>
            <p className="mt-4 text-center">
                    Not signed up?{' '}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                        Create an account
                    </Link>
            </p>
        </div>
    )
}
