'use client'

import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
const { default: Navbar } = require("@/components/navbar")

const App = () => {

    const router = useRouter()
    const [user, setUser] = useState("")
    const [show, setShow] = useState(false)

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) setUser(storedUser)
    }, [])


    const signOutHandler = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('role')

        document.cookie = "user=; path=/; max-age=0;"
        document.cookie = "role=; path=/; max-age=0;"

        router.push('/')
    }


    return (
        <>
            <section>
                <Navbar />

                <section className="flex flex-col gap-10 m-10 items-center justify-center">
                    <div className="flex flex-col gap-5 items-center">
                        <img src="/Logo.svg" alt="" width={100} />
                        <div className="flex flex-col gap-2 items-center">
                            <h1 className="font-bold text-2xl">{user}</h1>
                            <p className="italic opacity-50">No bio yet</p>
                        </div>
                    </div>

                    <div className="flex flex-row justify-around gap-5 w-full">
                        <button type="button" className="p-2 border w-full text-center rounded" onClick={() => setShow(true)}>Sign Out</button>
                    </div>

                    {show && (
                        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
                            <div className="flex flex-col bg-white rounded-lg shadow-lg p-6 gap-4 w-80">
                                <h1 className="text-center font-bold">Confirm to Sign Out</h1>
                                <button className="p-2 border rounded bg-red-500" onClick={signOutHandler}>Sign Out</button>
                                <button className="p-2 border rounded" onClick={() => setShow(false)}>Cancel</button>
                            </div>
                        </div>
                    )}
                </section>

            </section>
        </>
    )
}

export default App