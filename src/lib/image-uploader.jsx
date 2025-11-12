'use client'

import React, { useEffect, useState } from "react"
import imageCompression from "browser-image-compression"
import supabase from "./api-libs"

const ImageUploader = ({ barber }) => {
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [url, setUrl] = useState("")

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    setUploading(true)

    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
      })

      const fileName = `${barber}_${Date.now()}_${compressed.name}`
      const { data, error } = await supabase.storage
        .from("haircutResult")
        .upload(fileName, compressed)

      if (error) throw error

      const { data: publicUrl } = supabase.storage
        .from("haircutResult")
        .getPublicUrl(fileName)

      setUrl(publicUrl.publicUrl)
    } catch (err) {
      console.error("Upload failed:", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 items-centermx-10">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleUpload}
        className="border p-2 rounded"
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-40 h-40 object-cover rounded shadow"
        />
      )}

      {uploading && <p className="text-blue-500 italic">Uploading & compressing...</p>}

      {url && (
        <p className="text-green-600 text-sm break-all">
          Uploaded:{" "}
          <a href={url} target="_blank" className="underline">
            Link
          </a>
        </p>
      )}
    </div>
  )
}

export default ImageUploader
