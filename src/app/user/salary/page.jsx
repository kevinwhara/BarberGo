'use client'

import Navbar from "@/components/navbar"
import supabase from "@/lib/api-libs"
import React, { useEffect, useState } from "react"
import rupiah from "@/lib/money-formater"

const App = () => {
    const [user, setUser] = useState("")
    const [selectedMonth, setSelectedMonth] = useState("")
    const [data, setData] = useState([])
    const [salary, setSalary] = useState(0)
    const [total, setTotal] = useState(0)

    const getMonthData = (offset) => {
        const date = new Date()
        date.setMonth(date.getMonth() - offset)
        date.setDate(1)

        const label = date.toLocaleString("id-ID", { month: "long", year: "numeric" })
        const value = new Date(date.setHours(0, 0, 0, 0)).toISOString()

        return { label, value }
    }

    const options = [getMonthData(0), getMonthData(1), getMonthData(2)]

    const monthHandler = async (monthValue) => {
        const start = new Date(monthValue)
        const end = new Date(start)
        end.setMonth(start.getMonth() + 1)

        const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .eq("nama_tukang_cukur", user)
            .gte("created_at", start.toISOString())
            .lt("created_at", end.toISOString())

        if (error) {
            console.error(error)
            return
        }

        setData(data)

        const totalPendapatan = data.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
        setTotal(data.length)

        setSalary(totalPendapatan * 0.4)
    }

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"))
        if (storedUser) setUser(storedUser)
    }, [])

    useEffect(() => {
        if (user) {
            const currentMonth = getMonthData(0).value
            setSelectedMonth(currentMonth)
            monthHandler(currentMonth)
        }
    }, [user])

    return (
        <section>
            <Navbar />
            <section className="flex flex-col gap-10 m-10">
                {/* Salary Report */}
                <div className="flex flex-col gap-5">
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="font-bold">Salary Report:</h1>
                        <select
                            name="month"
                            id="month"
                            className="border p-1 rounded"
                            value={selectedMonth}
                            onChange={(e) => {
                                setSelectedMonth(e.target.value)
                                monthHandler(e.target.value)
                            }}
                        >
                            {options.map((opt, i) => (
                                <option key={i} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-5 p-5 border rounded-xl justify-between">
                        <div className="flex flex-row justify-between items-center">
                            <div>
                                <h1 className="text-2xl italic">
                                    {rupiah(salary)}
                                </h1>
                                <p className="text-[12px] text-gray-500">
                                    *40% dari total pendapatan
                                </p>
                            </div>
                            <img src="/hide.svg" alt="" className="w-5 h-5 opacity-50" />
                        </div>

                        <div className="text-sm text-gray-600">
                            Anda sudah menyelesaikan{" "}
                            <span className="font-semibold">{total}</span> pekerjaan
                        </div>
                    </div>
                </div>

                {/* Detail Transaction */}
                <div className="flex flex-col gap-5">
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="font-bold">Detail Transaction:</h1>
                    </div>

                    <div className="flex flex-col gap-3 p-5 border rounded-xl h-[450px] overflow-y-auto">
                        {data.length > 0 ? (
                            data.map((item) => (
                                <div key={item.id} className="border-b pb-2">
                                    <p className="font-semibold">{item.category}</p>
                                    <div className="flex flex-row justify-between">
                                        <p className="text-sm text-gray-600">
                                            {new Date(item.created_at).toLocaleString("id-ID")}
                                        </p>
                                        <p>{rupiah(item.amount)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic text-center mt-10 h-full">
                                Belum ada transaksi bulan ini
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </section>
    )
}

export default App
