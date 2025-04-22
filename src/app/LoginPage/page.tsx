"use client"

import { FormEvent, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from 'next/navigation'
import {generateHashedPassword} from  '@/lib/hashPassword'
import { showSuccessToast, showErrorToast, showLoadingToast } from '@/components/notify/Toast'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [usernameError, setUsernameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const res = await fetch('/api/LoginAPI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    }) 
    const data = await res.json()
  
    if (data.success) {
      router.push('/MainPage')
      showSuccessToast('Login Complete!')
    } else {
      showErrorToast(data.message)

      const message = data.message.toLowerCase()
      if (data.field === 'error') {
        setUsernameError(true)
        setPasswordError(true)
      } else {
        setUsernameError(false)
        setPasswordError(false)
      }
    }
  }

  const debugPasswordHash = async () => {
    const hashed = await generateHashedPassword(password)
    showSuccessToast('Copy password hash!')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-[#161616]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/Login/background.jpg" alt="Login Background" fill className="object-cover object-bottom-right opacity-70 brightness-100 grayscale" draggable={false} priority />
      </div>

      {/* Logo */}
      <div className="absolute top-10 left-5 z-10">
          <Image src="magic-shop_Logo.svg" alt="Logo" width={250} height={250} className="object-contain" draggable={false} />
      </div>

      {/* Login Form */}
      <div className="bg-[#323232]/90 rounded-lg p-8 w-full max-w-md z-10">
        <h1 className="font-dragon text-white text-4xl font-bold text-center mb-8 select-none" >LOGIN</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input type="text" placeholder="Username" 
            className={`w-full p-3 rounded bg-[#d9d9d9] text-[#161616] outline-none border-2 ${
              usernameError ? 'bg-[#ff9b85]' : 'bg-[#d9d9d9]'
            }`}
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              if (usernameError) setUsernameError(false)
            }}
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full p-3 rounded bg-[#d9d9d9] text-[#161616] outline-none border-2 ${
                passwordError ? 'bg-[#ff9b85]' : 'bg-[#d9d9d9]'
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (passwordError) setPasswordError(false)
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#161616]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="h-4 w-4 rounded border-white accent-[#e8443c]" />
              <label htmlFor="remember" className="text-white">
                Remember Me
              </label>
            </div>
            <Link href="\ForgetPassPage" className="text-white hover:text-[#e8443c] transition-colors cursor-pointer">
              Forget Password?
           </Link>
          </div>
            <button
              type="submit"
              className="w-full p-3 bg-[#e8443c] text-white rounded font-medium hover:bg-[#e8443c]/90 transition-colors">
              Sign In
            </button>
        </form>

        <div className="text-center mt-6 text-white">
          Don't have an account?{" "}
          <Link href="\SignUpPage" className="text-[#e8443c] hover:underline">
            Sign Up
          </Link>
        </div>
      </div>


     {/* For Debug */}
      <button
        type="submit"
        form="copyPass Has"
        className="absolute bottom-30 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        onClick={debugPasswordHash}>
          Copy Pass Hash for DB
      </button>
     


    </div>
  )
}
