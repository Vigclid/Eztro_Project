import { chooseImage, getAccessToken, getPhoneNumber } from "zmp-sdk";
import { Box, Button, Input, Page, Text } from "zmp-ui";
import { useState } from "react";
import Logo from "@/components/logo";

const apiUrl = `${import.meta.env.VITE_API_URL}v1/invoices/zalo`;
interface MeterField {
  value: string;
  imageUrl: string | null;
}

function HomePage() {
  const [water, setWater] = useState<MeterField>({ value: "", imageUrl: null });
  const [electric, setElectric] = useState<MeterField>({
    value: "",
    imageUrl: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneAccepted, setPhoneAccepted] = useState(false);
  const handleChooseImage = async (type: "water" | "electric") => {
    try {
      const result = await chooseImage({
        count: 1,
        sourceType: ["camera", "album"],
      });
      const url = result.filePaths?.[0] ?? null;
      if (url) {
        if (type === "water") setWater((prev) => ({ ...prev, imageUrl: url }));
        else setElectric((prev) => ({ ...prev, imageUrl: url }));
      }
    } catch (_) {}
  };

  const toBase64 = (url: string): Promise<string> =>
    fetch(url)
      .then((r) => r.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }),
      );

  const handleSubmit = async () => {
    if (!water.value || !electric.value) return;
    setLoading(true);
    try {
      const [accessToken, phoneRes, waterBase64, electricBase64] =
        await Promise.all([
          getAccessToken(),
          getPhoneNumber(),
          water.imageUrl ? toBase64(water.imageUrl) : Promise.resolve(null),
          electric.imageUrl
            ? toBase64(electric.imageUrl)
            : Promise.resolve(null),
        ]);
      if (!phoneRes?.token) {
        setPhoneAccepted(true);
        return;
      }
      const payload = {
        accessToken,
        phoneToken: phoneRes.token,
        waterNumber: water.value,
        waterImage: waterBase64,
        electricNumber: electric.value,
        electricImage: electricBase64,
      };
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }).catch((err) => console.error(err));
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWater({ value: "", imageUrl: null });
    setElectric({ value: "", imageUrl: null });
    setPhoneAccepted(false);
    setSubmitted(false);
  };

  return (
    <Page className="min-h-screen bg-white">
      {/* Header */}
      <Box
        className="flex flex-col items-center py-6 px-4"
        style={{
          background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
        }}
      >
        <Box
          className="mb-3"
          style={{ color: "#fff", width: 100, height: 46 }}
        />
        <Text.Title size="xLarge" className="!text-white font-bold">
          EzTro
        </Text.Title>
        <Text className="!text-green-100 text-sm mt-1">
          Nhập chỉ số điện – nước hàng tháng
        </Text>
      </Box>

      <Box className="px-4 py-6 space-y-6">
        {submitted ? (
          /* Success screen */
          <Box className="flex flex-col items-center py-12 space-y-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "#dcfce7" }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Text.Title size="large" className="!text-green-700 font-bold">
              Gửi thành công!
            </Text.Title>
            <Text className="text-gray-500 text-center text-sm">
              Chỉ số điện nước của bạn đã được ghi nhận.
            </Text>
            <Button
              style={{ background: "#16a34a", color: "#fff", marginTop: 16 }}
              onClick={handleReset}
            >
              Nhập lại
            </Button>
          </Box>
        ) : phoneAccepted ? (
          /* Success screen */
          <Box className="flex flex-col items-center py-12 space-y-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "#fce3dc" }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="#ff0000"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Text.Title size="large" className="!text-red-700 font-bold">
              Gửi không thành công!
            </Text.Title>
            <Text className="text-gray-500 text-center text-sm">
              Vui lòng cấp quyền số điện thoại để có trải nghiệm tốt nhất.
            </Text>
            <Button
              style={{ background: "#16a34a", color: "#fff", marginTop: 16 }}
              onClick={handleReset}
            >
              Nhập lại
            </Button>
          </Box>
        ) : (
          <>
            {/* Water meter */}
            <Box
              className="rounded-2xl p-4 space-y-3"
              style={{ border: "2px solid #bbf7d0", background: "#f0fdf4" }}
            >
              <Box className="flex items-center space-x-2 mb-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C12 2 5 9.5 5 14a7 7 0 0014 0C19 9.5 12 2 12 2z"
                    stroke="#16a34a"
                    strokeWidth="2"
                    fill="#bbf7d0"
                  />
                </svg>
                <Text className="font-semibold text-green-800">
                  Chỉ số nước
                </Text>
              </Box>

              <Input
                type="number"
                placeholder="Nhập số nước (m³)"
                value={water.value}
                onChange={(e) =>
                  setWater((prev) => ({ ...prev, value: e.target.value }))
                }
                style={{
                  borderColor: "#16a34a",
                  background: "#fff",
                  color: "#111",
                }}
              />

              <button
                className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl text-sm font-medium"
                style={{
                  border: "1.5px dashed #16a34a",
                  background: water.imageUrl ? "#dcfce7" : "#fff",
                  color: "#16a34a",
                }}
                onClick={() => handleChooseImage("water")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="2"
                    y="6"
                    width="20"
                    height="14"
                    rx="2"
                    stroke="#16a34a"
                    strokeWidth="1.8"
                  />
                  <circle
                    cx="12"
                    cy="13"
                    r="3.5"
                    stroke="#16a34a"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M8 6V5a2 2 0 014 0v1"
                    stroke="#16a34a"
                    strokeWidth="1.8"
                  />
                </svg>
                <span>
                  {water.imageUrl
                    ? "Đã chụp ảnh ✓"
                    : "Chụp / chọn ảnh đồng hồ nước"}
                </span>
              </button>

              {water.imageUrl && (
                <img
                  src={water.imageUrl}
                  alt="Ảnh đồng hồ nước"
                  className="w-full rounded-xl object-cover"
                  style={{ maxHeight: 160 }}
                />
              )}
            </Box>

            {/* Electric meter */}
            <Box
              className="rounded-2xl p-4 space-y-3"
              style={{ border: "2px solid #fde68a", background: "#fffbeb" }}
            >
              <Box className="flex items-center space-x-2 mb-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13 2L4.5 13.5H12L11 22L19.5 10.5H12L13 2z"
                    stroke="#ca8a04"
                    strokeWidth="2"
                    fill="#fde68a"
                    strokeLinejoin="round"
                  />
                </svg>
                <Text className="font-semibold" style={{ color: "#92400e" }}>
                  Chỉ số điện
                </Text>
              </Box>

              <Input
                type="number"
                placeholder="Nhập số điện (kWh)"
                value={electric.value}
                onChange={(e) =>
                  setElectric((prev) => ({ ...prev, value: e.target.value }))
                }
                style={{
                  borderColor: "#ca8a04",
                  background: "#fff",
                  color: "#111",
                }}
              />

              <button
                className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl text-sm font-medium"
                style={{
                  border: "1.5px dashed #ca8a04",
                  background: electric.imageUrl ? "#fef3c7" : "#fff",
                  color: "#ca8a04",
                }}
                onClick={() => handleChooseImage("electric")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="2"
                    y="6"
                    width="20"
                    height="14"
                    rx="2"
                    stroke="#ca8a04"
                    strokeWidth="1.8"
                  />
                  <circle
                    cx="12"
                    cy="13"
                    r="3.5"
                    stroke="#ca8a04"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M8 6V5a2 2 0 014 0v1"
                    stroke="#ca8a04"
                    strokeWidth="1.8"
                  />
                </svg>
                <span>
                  {electric.imageUrl
                    ? "Đã chụp ảnh ✓"
                    : "Chụp / chọn ảnh đồng hồ điện"}
                </span>
              </button>

              {electric.imageUrl && (
                <img
                  src={electric.imageUrl}
                  alt="Ảnh đồng hồ điện"
                  className="w-full rounded-xl object-cover"
                  style={{ maxHeight: 160 }}
                />
              )}
            </Box>

            {/* Submit button */}
            <Button
              fullWidth
              loading={loading}
              disabled={!water.value || !electric.value}
              style={{
                background:
                  water.value && electric.value
                    ? "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)"
                    : "#d1d5db",
                color: "#fff",
                borderRadius: 16,
                height: 52,
                fontSize: 16,
                fontWeight: 600,
                border: "none",
              }}
              onClick={handleSubmit}
            >
              Gửi chỉ số
            </Button>
          </>
        )}
      </Box>
    </Page>
  );
}

export default HomePage;
