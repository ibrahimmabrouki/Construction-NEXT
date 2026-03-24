export const uploadToImgBB = async (file: File): Promise<string> => {
  try {
    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      throw new Error("IMGBB_API_KEY is missing");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error("Image upload failed");
    }

    return data.data.url;
  } catch (error) {
    console.error("ImgBB upload error:", error);
    throw error;
  }
};
