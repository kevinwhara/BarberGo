'use client'

import Navbar from "@/components/navbar"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"
import MenuCard from "@/components/menuCard"
import supabase from "@/lib/api-libs"

const App = () => {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [barber, setBarber] = useState(0)

    useEffect(() => {
        console.log("The developer love you all guys")
        const storedUser = localStorage.getItem('user')
        const storedRole = localStorage.getItem('role')
        
        if (storedUser && storedRole === "admin") {
            setUser(storedUser)
            fetchJumlahBarber()
        } else {
            router.push("/")
        }
    }, [router])

    const fetchJumlahBarber = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact' })
            .eq('role', 'user')

        if (error) {
            console.error(error)
            return
        }

        setBarber(data.length)
    }

    return (
        <>
            <Navbar />
            <section className="flex flex-col m-10 gap-7">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-normal italic">
                        <span className="font-bold not-italic">Welcome back, </span>
                        {user || "User"}!
                    </h1>
                    <p className="text-sm">Manage your team to be better!</p>
                </div>

                <MenuCard 
                    link={'admin/people'} 
                    title={'Manage People'} 
                    description={`${barber} barber registered`} 
                    image={'/TransactionIcon.svg'} 
                />
                <MenuCard 
                    link={'admin/report'} 
                    title={'Transaction Report'} 
                    description={"Money I'm Comin'"} 
                    image={'/ReportIcon.svg'} 
                />
                <MenuCard 
                    link={'admin/account'} 
                    title={'Account'} 
                    description={"Manage Your Account"} 
                    image={'/AccountIcon.svg'} 
                />
            </section>
        </>
    )
}

export default App
