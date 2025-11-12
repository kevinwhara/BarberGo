'use client'

import Navbar from "@/components/navbar"
import supabase from "@/lib/api-libs"
import React, { useEffect, useState } from "react"
import rupiah from "@/lib/money-formater"

const Page = () => {
    const [users, setUsers] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [userDetail, setUserDetail] = useState(null)
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {
        fetchUserBarber()
    }, [])

    const fetchUserBarber = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, name, created_at')
            .eq('role', 'user')

        if (error) console.error(error)
        else setUsers(data)
    }

    const handleDetailClick = async (user) => {
        setSelectedUser(user)
        setLoadingDetail(true)
        setShowModal(true)

        const now = new Date()
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

        const { data, error } = await supabase
            .from('transactions')
            .select('amount, created_at')
            .eq('nama_tukang_cukur', user.name)
            .gte('created_at', firstDay)
            .lte('created_at', lastDay)

        if (error) {
            console.error(error)
            setUserDetail(null)
        } else {
            const totalKerja = data.length
            const totalGaji = data.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0) * 0.4
            setUserDetail({ totalKerja, totalGaji })
        }

        setLoadingDetail(false)
    }


    const handleDelete = async (id) => {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', id)

        if (error) {
            console.error(error)
            alert("Gagal menghapus akun.")
        } else {
            alert("Akun berhasil dihapus!")
            setUsers(users.filter((user) => user.id !== id))
            setShowConfirm(false)
            setShowModal(false)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    return (
        <>
            <Navbar />
            <section className="flex flex-col m-10 gap-7">
                <h1 className="font-bold">
                    Daftar Barber ({users.length})
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="p-5 border rounded-xl shadow hover:shadow-md transition flex flex-col justify-between"
                        >
                            <div>
                                <h2 className="text-lg font-semibold">{user.name || "Tanpa Nama"}</h2>
                                <p className="text-sm text-gray-500 italic">
                                    <span className="text-black not-italic">Joined at: </span>{formatDate(user.created_at)}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDetailClick(user)}
                                className="mt-4 border px-4 py-2 rounded text-sm hover:bg-gray-100 transition"
                            >
                                Detail
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal Detail */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-96 relative">
                        {loadingDetail ? (
                            <p className="text-center text-gray-500">Loading...</p>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold mb-4 text-center">
                                    {selectedUser?.name}
                                </h2>
                                {userDetail ? (
                                    <div className="space-y-3 text-center">
                                        <p>Total Bekerja: <span className="font-semibold">{userDetail.totalKerja} kali</span></p>
                                        <p>Gaji Bulan Ini: <span className="font-semibold">{rupiah(userDetail.totalGaji)}</span></p>
                                        <p className="text-gray-500 text-sm italic">
                                            Joined at: {formatDate(selectedUser?.created_at)}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center">Tidak ada data transaksi</p>
                                )}
                                <div className="mt-6 flex flex-col gap-3">
                                    <button
                                        onClick={() => setShowConfirm(true)}
                                        className="px-5 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                                    >
                                        Delete Account
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-5 py-2 text-sm bg-gray-200 rounded-xl hover:bg-gray-300 transition"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Delete */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
                        <h3 className="text-lg font-semibold mb-3">Yakin ingin menghapus akun ini?</h3>
                        <p className="text-sm text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan.</p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => handleDelete(selectedUser.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition text-sm"
                            >
                                Ya, Hapus
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300 transition text-sm"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Page
