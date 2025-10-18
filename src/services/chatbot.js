export async function askGemini(message) {
  try {
    const currentDocGia = JSON.parse(localStorage.getItem('docgia'));
    const docGiaId = currentDocGia?.MADOCGIA || null;
    const docGiaMongoId = currentDocGia?._id || null;

    console.log("📤 Gửi lên chatbot:", { message, docGiaId, docGiaMongoId });
    const response = await fetch('http://localhost:3000/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, docGiaId, docGiaMongoId }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('chatbot API lỗi:', response.status, text);
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error('Lỗi khi gọi API chatbot:', error);
    throw error;
  }
}
