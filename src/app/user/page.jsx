'use client'

import MenuCard from "@/components/menuCard"
import Navbar from "@/components/navbar"
import { useRouter } from "next/navigation"
import React, { useState, useEffect } from "react"

const App = () => {
    const router = useRouter()
    const [user, setUser] = useState(null)

    useEffect(() => {
        console.log("The developer love you all guys")
        const storedUser = localStorage.getItem('user')
        const storedRole = localStorage.getItem('role')
        if (storedUser && storedRole === "user") {
            //   console.log("Logged in as:", storedUser)
            setUser(storedUser)
        } else {
            router.push("/")
        }
    }, [router])

    if (!user) return <p>Loading...</p>

    return (
        <>
            <Navbar/>
            <section className="flex flex-col m-10 gap-7">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-normal italic"><span className="font-bold not-italic">Welcome back, </span>{user || user || "User"}!</h1>
                    <p className="text-sm">Let's make someone handsome!</p>
                </div>

                <MenuCard link={"/user/transaction"} title={"Transaction"} description={"3 Nov 2025"} image={"TransactionIcon.svg"}/>
                <MenuCard link={"/user/salary"} title={"Salary Report"} description={"Rp. 50.000"} image={"ReportIcon.svg"}/>
                <MenuCard link={"/user/account"} title={"Manage Account"} description={"Setting"} image={"AccountIcon.svg"}/>
            </section>
        </>
    )
}

export default App
