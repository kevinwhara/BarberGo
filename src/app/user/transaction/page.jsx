'use client'

import Navbar from "@/components/navbar"
import supabase from "@/lib/api-libs"
import ImageUploader from "@/lib/image-uploader"
import rupiah from "@/lib/money-formater"
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

const Transaction = () => {

    const router = useRouter()

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        // const storedURL = localStorage.getItem('imgURL')
        if (storedUser) setUser(storedUser)
        // if (storedURL) setURL(storedURL)
    }, [])

    const submitHandler = async (e) => {
        e.preventDefault()

        const { data, error } = await supabase
            .from('transactions')
            .insert([{ nama_tukang_cukur: user, category: category, amount: amount, description: description }])
            .select()

        if (error) {
            console.error(error)
            setErrorMsg(error.message)
            return
        }

        if (data && data.length > 0) {
            router.push("/user")
        }
    }

    const priceList = {
        "Potong Rambut": 20000,
        "Cukur Jenggot & Kumis": 15000,
        "Styling Rambut": 30000,
    }

    const handleCategoryChange = (e) => {
        const selected = e.target.value
        setCategory(selected)

        // kalau kategori ada di daftar, langsung isi amount
        if (priceList[selected]) {
            setAmount(priceList[selected])
        } else {
            setAmount("") // kosongin kalau bukan kategori valid
        }
    }

    const [user, setUser] = useState("")
    const [category, setCategory] = useState("")
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [qris, setQris] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")

    return (
        <>
            <Navbar />
            <section className="flex flex-col m-10 gap-4">
                <h1 className="font-bold">New Transaction:</h1>
                <form className="flex flex-col gap-4" onSubmit={submitHandler}>

                    <div className="flex flex-col gap-2">
                        <label>Category: </label>
                        <select
                            name="Category"
                            id="Category"
                            className="p-2 border rounded"
                            required
                            onChange={handleCategoryChange}
                        >
                            <option value="">-- Pilih Kategori --</option>
                            <option value="Potong Rambut">Potong Rambut</option>
                            <option value="Cukur Jenggot & Kumis">Cukur Jenggot & Kumis</option>
                            <option value="Styling Rambut">Styling Rambut</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Payment: </label>

                        <div className="flex flex-row gap-4 items-center">
                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                className="p-2 border rounded w-full"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <button
                                type="button"
                                className="p-2 border rounded w-full italic bg-blue-400 text-white border-black hover:bg-blue-600"
                                onClick={() => setQris(true)}
                            >
                                QRIS
                            </button>
                        </div>
                    </div>


                    <div className="flex flex-col gap-2">
                        <label>Description: </label>

                        <input
                            type="text"
                            name="Optional"
                            placeholder="Description"
                            className="p-2 border rounded w-full"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Haircur Result: </label>
                        <ImageUploader barber={user} />
                    </div>


                    {amount && (
                        <p className="text-gray-600 italic">
                            <span className="italic">Total: </span> {rupiah(amount)}
                        </p>
                    )}

                    <input type="submit" className="p-2 border rounded bg-green-400 hover:bg-green-600 transition-all 0.3s" />

                    {qris && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="flex flex-col bg-white rounded-lg shadow-lg p-6 gap-4 w-80">
                                <h2 className="text-lg font-bold mb-2">Scan To Pay</h2>
                                <img src="/qris.jpg" alt="qr code not exist" className="rounded border" />
                                <p className="text-gray-600 mb-4">
                                    <span className="italic">Total: </span>{rupiah(amount)}
                                </p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setQris(false)}
                                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Tutup
                                    </button>
                                    <button
                                        onClick={() => setQris(false)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Simpan
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </section>
        </>
    )
}

export default Transaction
