import React from "react";

export default function page() {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <img src="Barber Go Logo.svg" alt="" width={250}/>
            <h1 className="text-3xl font-bold text-red-500 mb-4">Unauthorized 🚫</h1>
            <p className="text-gray-600">You don’t have permission to access this page.</p>
        </div>
    )
}
