'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import supabase from "@/lib/api-libs";
import React from 'react'
import Link from 'next/link';
import BarberGo from "@/images/Barber Go Logo.svg"
import Image from 'next/image';
import {logout, saveUserSession} from "@/lib/session"

export default function RegisterPage() {
    const [nama, setNama] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const router = useRouter()

    useEffect(() => {
        logout()

    }, [])

    const signInHandler = async (e) => {
        e.preventDefault()

        const { data, error } = await supabase
            .from('profiles')
            .insert([{ name: nama, email: email, password: password, role: "user" }])
            .select()

        if (error) {
            console.error(error)
            setErrorMsg(error.message)
            return
        }

        if (data && data.length > 0) {
            const user = data[0]
            saveUserSession( nama,  "user")
            router.push("/user")
        }
    }

    return (
        <section className="h-screen flex justify-center items-center">
            <form
                onSubmit={signInHandler}
                className="flex flex-col border p-10 gap-5 md:w-[400px] w-[330px] rounded-xl bg-white shadow-lg"
            >
                <Image src={BarberGo} alt={"Barber Go"} />
                <h1 className="text-2xl font-bold text-center">Sign Up</h1>
                <p className="text-center text-gray-600">
                    Enter your credentials to continue
                </p>

                <input
                    name="name"
                    type="name"
                    placeholder="Enter your full name"
                    className="p-2 border rounded w-full"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="p-2 border rounded w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="p-2 border rounded w-full"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {errorMsg && (
                    <p className="text-red-500 text-sm text-center">{errorMsg}</p>
                )}

                <button
                    type="submit"
                    className="p-2 border rounded w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white transition"
                // onClick={signInHandler}
                >
                    Sign In
                </button>

                <div className="flex justify-center gap-2 text-sm">
                    <span>Already have an account?</span>
                    <Link href="/" className="text-blue-700 font-medium">
                        Click here!
                    </Link>
                </div>
            </form>
        </section>
    )
}
