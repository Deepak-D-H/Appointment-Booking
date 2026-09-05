const upload_preset = import.meta.env.VITE_UPLOAD_PRESET
const cloud_name = import.meta.env.VITE_CLOUD_NAME


const uploadImageCloudinary = async (file) => {
  try {
    const uploadData = new FormData()
    uploadData.append("file", file)
    uploadData.append("upload_preset", upload_preset)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    )

    if (!res.ok) {
      throw new Error("Cloudinary upload failed")
    }

    const data = await res.json()
    console.log("Cloudinary Response:", data)
    return data
  } catch (error) {
    console.error("Upload error:", error)
    // rethrow so callers can handle the failure (avoids returning undefined)
    throw error
  }
}

// const uploadImageCloudinary = async(file)=>{

//     const uploadData = new FormData()

//     uploadData.append('file',file)
//     uploadData.append('upload_preset',upload_preset)
//     uploadData.append('cloud_name',cloud_name)

//     const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,{
//       method:"post",
//       body:uploadData,
//     })
//     const data = await res.json()
//     return data    //---> important
// } 
export default uploadImageCloudinary
 
 