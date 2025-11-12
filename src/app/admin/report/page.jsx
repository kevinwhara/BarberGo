'use client'

import Navbar from "@/components/navbar"
import supabase from "@/lib/api-libs"
import rupiah from "@/lib/money-formater"
import React, { useEffect, useState } from "react"

const Page = () => {
    const [transactions, setTransactions] = useState([])
    const [total, setTotal] = useState(0)
    const [pendapatan, setPendapatan] = useState(0)
    const [selectedMonth, setSelectedMonth] = useState("")

    const getMonthData = (offset) => {
        const date = new Date()
        date.setMonth(date.getMonth() - offset)

        const label = date.toLocaleString("id-ID", { month: "long", year: "numeric" })
        const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

        return { label, value }
    }

    const monthHandler = async (monthValue) => {
        const start = new Date(monthValue)
        const end = new Date(start)
        end.setMonth(start.getMonth() + 1)

        const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .gte("created_at", start.toISOString())
            .lt("created_at", end.toISOString())

        if (error) {
            console.error(error)
            return
        }

        setTransactions(data)

        const totalPendapatan = data.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
        setTotal(data.length)
        setPendapatan(totalPendapatan)
    }



    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'numeric',
            year: 'numeric'
        })
    }

    const options = [getMonthData(0), getMonthData(1), getMonthData(2)]

    useEffect(() => {
        const currentMonth = getMonthData(0).value
        monthHandler(currentMonth)
    }, [])

    return (
        <>
            <Navbar />
            <section className="flex flex-col m-10 gap-7">
                <div className="flex flex-col gap-5 p-5 border rounded-xl justify-between">

                    <div className="flex flex-row justify-between items-center">
                        <h1 className="font-bold">Money Report:</h1>
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

                    <div className="flex flex-row justify-between items-center">
                        <div>
                            <h1 className="text-2xl italic">
                                {rupiah(pendapatan)}
                            </h1>
                            <p className="text-[12px] text-gray-500">
                                *total pendapatan
                            </p>
                        </div>
                        <img src="/hide.svg" alt="" className="w-5 h-5 opacity-50" />
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <div>
                            <h1 className="text-2xl italic">
                                {rupiah([pendapatan * 0.4])}
                            </h1>
                            <p className="text-[12px] text-gray-500">
                                *total pendapatan bersih
                            </p>
                        </div>
                        <img src="/hide.svg" alt="" className="w-5 h-5 opacity-50" />
                    </div>

                    <div className="text-sm text-gray-600">
                        <span className="font-semibold">{total}</span> Kali Transaksi di bulan ini
                    </div>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="font-bold">Detail Transaction:</h1>
                    </div>

                    <div className="flex flex-col gap-3 p-5 border rounded-xl h-[450px] overflow-y-auto">
                        {transactions.length > 0 ? (
                            transactions.map((item) => (
                                <div key={item.id} className="flex flex-row justify-between border-b pb-2">
                                    <div className="flex flex-col gap-1">
                                        <h1 className="font-bold">{item.category}</h1>
                                        <h1 className="italic">
                                            <span className="font-bold not-italic">Barber: </span>
                                            {item.nama_tukang_cukur}
                                        </h1>
                                    </div>
                                    <div>
                                        <h1>{formatDate(item.created_at)}</h1>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="flex justify-center text-center h-[400px] items-center italic opacity-50">
                                Tidak ada transaksi di bulan ini
                            </p>
                        )}
                    </div>
                </div>

            </section>
        </>
    )
}

export default Page
