import React from "react"

const { default: Link } = require("next/link")

const MenuCard = ({ link, title, description, image }) => {
    return (
        <Link className="flex flex-row items-center bg-[#303030] p-4 gap-4 rounded-2xl" href={link}>
            <img src={image} alt="" width={60} />
            <div className="flex flex-col text-white">
                <h1 className="font-bold ">{title}</h1>
                <p className="font-normal text-[12px] opacity-30">{description}</p>
            </div>
        </Link>
    )
}

export default MenuCard