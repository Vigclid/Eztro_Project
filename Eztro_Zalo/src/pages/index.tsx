import { chooseImage, getAccessToken, getPhoneNumber } from "zmp-sdk";
import { Box, Button, Input, Page, Text } from "zmp-ui";
import { useEffect, useState } from "react";

const API = `${import.meta.env.VITE_API_URL}v1/invoices/`;

// ── Types ─────────────────────────────────────────────────────────────────────
type ZaloTab = "meter" | "invoices" | "history";
type AIStatus = "idle" | "checking" | "valid" | "invalid";

interface MeterField {
  value: string;
  imageUrl: string | null;
}

interface Invoice {
  _id: string;
  status: string;
  totalAmount: number;
  rentalFee: number;
  electricityCharge: number;
  waterCharge: number;
  utilities?: { key: string; value: number }[];
  transactionImage?: string;
  createDate: string;
  roomId?: { roomName?: string; houseId?: { houseName?: string } };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
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

const fmt = (n: number) => (n ?? 0).toLocaleString("vi-VN") + " đ";

const STATUS_LABEL: Record<string, string> = {
  "payment-processing": "CHỜ THANH TOÁN",
  "tenant-confirmed": "ĐÃ XÁC NHẬN",
  completed: "ĐÃ HOÀN THÀNH",
};

const STATUS_BG: Record<string, string> = {
  "payment-processing": "#E3F2FD",
  "tenant-confirmed": "#F3E5F5",
  completed: "#E8F5E9",
};

const STATUS_COLOR: Record<string, string> = {
  "payment-processing": "#1565C0",
  "tenant-confirmed": "#6A1B9A",
  completed: "#2E7D32",
};

// ── Main Component ────────────────────────────────────────────────────────────
function HomePage() {
  const [activeTab, setActiveTab] = useState<ZaloTab>("meter");

  // Zalo auth — accessToken is long-lived; phoneNumber resolved once on mount
  const [zaloTokens, setZaloTokens] = useState<{
    accessToken: string;
    phoneNumber: string;
  } | null>(null);
  const [phoneError, setPhoneError] = useState(false);

  // ── Meter tab ──────────────────────────────────────────────────────────────
  const [water, setWater] = useState<MeterField>({ value: "", imageUrl: null });
  const [electric, setElectric] = useState<MeterField>({
    value: "",
    imageUrl: null,
  });
  const [meterSubmitted, setMeterSubmitted] = useState(false);
  const [meterLoading, setMeterLoading] = useState(false);

  // ── Invoices + history tab ─────────────────────────────────────────────────
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Payment image + AI ─────────────────────────────────────────────────────
  const [payImg, setPayImg] = useState<{
    invoiceId: string;
    url: string;
  } | null>(null);
  const [aiStatus, setAiStatus] = useState<AIStatus>("idle");
  const [aiMessage, setAiMessage] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmSuccess, setConfirmSuccess] = useState<string | null>(null);

  // Load Zalo tokens on mount — exchange phoneToken once to get phoneNumber
  useEffect(() => {
    (async () => {
      try {
        const [at, pr] = await Promise.all([
          getAccessToken(),
          getPhoneNumber(),
        ]);
        if (!pr?.token) {
          setPhoneError(true);
          return;
        }
        const res = await fetch(`${API}zalo/phone`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: at, phoneToken: pr.token }),
        });
        const json = await res.json();
        if (json.status !== "success" || !json.data?.phoneNumber) {
          setPhoneError(true);
          return;
        }
        setZaloTokens({ accessToken: at, phoneNumber: json.data.phoneNumber });
      } catch {
        setPhoneError(true);
      }
    })();
  }, []);

  // Fetch invoices when tokens ready
  useEffect(() => {
    if (zaloTokens) fetchInvoices();
  }, [zaloTokens]);

  const fetchInvoices = async () => {
    if (!zaloTokens) return;
    setInvoicesLoading(true);
    try {
      const res = await fetch(`${API}zalo/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zaloTokens),
      });
      const json = await res.json();
      if (json.status === "success" && Array.isArray(json.data)) {
        setInvoices(json.data);
      }
    } catch (_) {
    } finally {
      setInvoicesLoading(false);
    }
  };

  // ── Meter handlers ─────────────────────────────────────────────────────────
  const handleChooseImage = async (type: "water" | "electric") => {
    try {
      const result = await chooseImage({
        count: 1,
        sourceType: ["camera", "album"],
      });
      const url = result.filePaths?.[0] ?? null;
      if (url) {
        if (type === "water") setWater((p) => ({ ...p, imageUrl: url }));
        else setElectric((p) => ({ ...p, imageUrl: url }));
      }
    } catch (_) {}
  };

  const handleMeterSubmit = async () => {
    if (!water.value || !electric.value) return;
    if (!zaloTokens) {
      setPhoneError(true);
      return;
    }
    setMeterLoading(true);
    try {
      const [waterBase64, electricBase64] = await Promise.all([
        water.imageUrl ? toBase64(water.imageUrl) : Promise.resolve(null),
        electric.imageUrl ? toBase64(electric.imageUrl) : Promise.resolve(null),
      ]);
      fetch(`${API}zalo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...zaloTokens,
          waterNumber: water.value,
          waterImage: waterBase64,
          electricNumber: electric.value,
          electricImage: electricBase64,
        }),
      }).catch((e) => console.error(e));
      setMeterSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setMeterLoading(false);
    }
  };

  const handleMeterReset = () => {
    setWater({ value: "", imageUrl: null });
    setElectric({ value: "", imageUrl: null });
    setMeterSubmitted(false);
    setPhoneError(false);
  };

  // ── Payment image + AI handlers ────────────────────────────────────────────
  const handleChoosePayImage = async (invoiceId: string, amount: number) => {
    try {
      const result = await chooseImage({
        count: 1,
        sourceType: ["camera", "album"],
      });
      const url = result.filePaths?.[0] ?? null;
      if (!url) return;
      setPayImg({ invoiceId, url });
      setAiStatus("idle");
      setAiMessage("");
      runAICheck(url, invoiceId, amount);
    } catch (_) {}
  };

  const runAICheck = async (
    imageUrl: string,
    _invoiceId: string,
    amount: number,
  ) => {
    setAiStatus("checking");
    try {
      const b64 = await toBase64(imageUrl);
      const res = await fetch(`${API}zalo/verify-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: b64, invoiceAmount: amount }),
      });
      const json = await res.json();
      if (json.status === "success" && json.data) {
        const { isTransactionReceipt, amountMatches, message } = json.data;
        setAiStatus(
          isTransactionReceipt && amountMatches ? "valid" : "invalid",
        );
        setAiMessage(message);
      } else {
        setAiStatus("invalid");
        setAiMessage("Không thể xác minh ảnh");
      }
    } catch {
      setAiStatus("invalid");
      setAiMessage("Lỗi kiểm tra, vui lòng thử lại");
    }
  };

  const handleConfirmPayment = async (invoiceId: string) => {
    if (!zaloTokens) return;
    if (aiStatus !== "valid") {
      setAiStatus("invalid");
      setAiMessage("Xác minh ảnh trước khi gửi!");
      return;
    }
    setConfirming(true);
    try {
      let base64: string | null = null;
      if (payImg?.invoiceId === invoiceId && payImg.url) {
        base64 = await toBase64(payImg.url);
      }
      const res = await fetch(`${API}zalo/${invoiceId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...zaloTokens, transactionImage: base64 }),
      });
      const json = await res.json();
      if (json.status === "success") {
        setConfirmSuccess(invoiceId);
        setPayImg(null);
        setAiStatus("idle");
        await fetchInvoices();
      }
    } catch (_) {
    } finally {
      setConfirming(false);
    }
  };

  // ── Invoice breakdown (shared) ─────────────────────────────────────────────
  const renderBreakdown = (inv: Invoice) => (
    <div
      style={{
        borderTop: "1px solid #eee",
        paddingTop: 10,
        marginTop: 8,
        marginBottom: 8,
      }}
    >
      {[
        { label: "Tiền phòng", value: fmt(inv.rentalFee) },
        { label: "Tiền điện", value: fmt(inv.electricityCharge) },
        { label: "Tiền nước", value: fmt(inv.waterCharge) },
        ...(inv.utilities?.map((u) => ({
          label: u.key,
          value: fmt(u.value),
        })) ?? []),
      ].map((row, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 14, color: "#777" }}>{row.label}</span>
          <span style={{ fontSize: 14, color: "#333", fontWeight: 500 }}>
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );

  const pendingInvoices = invoices.filter(
    (i) => i.status === "payment-processing" || i.status === "tenant-confirmed",
  );
  const historyInvoices = invoices.filter((i) => i.status === "completed");

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Page className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Box
        className="flex flex-col items-center py-4 px-4"
        style={{
          background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
        }}
      >
        <Text.Title size="xLarge" className="!text-white font-bold">
          EzTro
        </Text.Title>
        <Text className="!text-green-100 text-sm mt-1">
          {activeTab === "meter"
            ? "Nhập chỉ số điện – nước hàng tháng"
            : activeTab === "invoices"
              ? "Hóa đơn của tôi"
              : "Lịch sử thanh toán"}
        </Text>
      </Box>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        {(["meter", "invoices", "history"] as ZaloTab[]).map((tab) => {
          const labels: Record<ZaloTab, string> = {
            meter: "Chỉ số",
            invoices: "Hóa đơn",
            history: "Lịch sử",
          };
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              style={{
                flex: 1,
                padding: "12px 0",
                fontSize: 14,
                fontWeight: 600,
                color: active ? "#16a34a" : "#9ca3af",
                background: "none",
                border: "none",
                borderBottom: active
                  ? "2.5px solid #16a34a"
                  : "2.5px solid transparent",
                cursor: "pointer",
                position: "relative",
              }}
              onClick={() => setActiveTab(tab)}
            >
              {labels[tab]}
              {tab === "invoices" && pendingInvoices.length > 0 && (
                <span
                  style={{
                    marginLeft: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    background: "#16a34a",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "1px 5px",
                  }}
                >
                  {pendingInvoices.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <Box className="px-4 py-4 space-y-4">
        {/* ── METER TAB ── */}
        {activeTab === "meter" && (
          <>
            {meterSubmitted ? (
              <ResultBox
                success
                title="Gửi thành công!"
                sub="Chỉ số điện nước của bạn đã được ghi nhận."
                onAction={handleMeterReset}
                actionLabel="Nhập lại"
              />
            ) : phoneError ? (
              <ResultBox
                success={false}
                title="Không thể gửi!"
                sub="Vui lòng cấp quyền số điện thoại để có trải nghiệm tốt nhất."
                onAction={handleMeterReset}
                actionLabel="Thử lại"
              />
            ) : (
              <>
                <MeterCard
                  type="water"
                  field={water}
                  onChange={(v) => setWater((p) => ({ ...p, value: v }))}
                  onChooseImage={() => handleChooseImage("water")}
                />
                <MeterCard
                  type="electric"
                  field={electric}
                  onChange={(v) => setElectric((p) => ({ ...p, value: v }))}
                  onChooseImage={() => handleChooseImage("electric")}
                />
                <Button
                  fullWidth
                  loading={meterLoading}
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
                  onClick={handleMeterSubmit}
                >
                  Gửi chỉ số
                </Button>
              </>
            )}
          </>
        )}

        {/* ── INVOICES TAB ── */}
        {activeTab === "invoices" && (
          <>
            {invoicesLoading ? (
              <Box className="flex flex-col items-center py-12">
                <Text className="text-gray-400">Đang tải...</Text>
              </Box>
            ) : pendingInvoices.length === 0 ? (
              <Box className="flex flex-col items-center py-12 space-y-3">
                <Text className="text-gray-400 text-center">
                  Không có hóa đơn nào đang chờ thanh toán
                </Text>
                <button
                  style={{
                    color: "#16a34a",
                    fontSize: 13,
                    background: "none",
                    border: "none",
                    textDecoration: "underline",
                  }}
                  onClick={fetchInvoices}
                >
                  Tải lại
                </button>
              </Box>
            ) : (
              pendingInvoices.map((inv) => {
                const isExpanded = expandedId === inv._id;
                const hasPayImg = payImg?.invoiceId === inv._id;
                const isPaymentProcessing = inv.status === "payment-processing";
                const isDone =
                  confirmSuccess === inv._id ||
                  inv.status === "tenant-confirmed";

                return (
                  <div
                    key={inv._id}
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      padding: 16,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                      marginBottom: 12,
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        cursor: "pointer",
                      }}
                      onClick={() => setExpandedId(isExpanded ? null : inv._id)}
                    >
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: 16,
                            margin: 0,
                            color: "#1a1a1a",
                          }}
                        >
                          {inv.roomId?.roomName || "Phòng"}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#666",
                            margin: "2px 0 0",
                          }}
                        >
                          {inv.roomId?.houseId?.houseName || "Nhà trọ"}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "#999",
                            margin: "2px 0 0",
                          }}
                        >
                          {inv.createDate
                            ? new Date(inv.createDate).toLocaleDateString(
                                "vi-VN",
                              )
                            : ""}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: STATUS_BG[inv.status] ?? "#eee",
                          color: STATUS_COLOR[inv.status] ?? "#333",
                        }}
                      >
                        {STATUS_LABEL[inv.status] ?? inv.status}
                      </span>
                    </div>

                    {isExpanded && renderBreakdown(inv)}

                    {/* Total */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: 10,
                        marginTop: 8,
                      }}
                    >
                      <span style={{ fontWeight: 700, color: "#333" }}>
                        Tổng cộng
                      </span>
                      <span
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: "#16a34a",
                        }}
                      >
                        {fmt(inv.totalAmount)}
                      </span>
                    </div>

                    {/* Confirmed badge */}
                    {isDone && (
                      <div
                        style={{
                          marginTop: 10,
                          background: "#F3E5F5",
                          borderRadius: 10,
                          padding: "8px 12px",
                          textAlign: "center",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#6A1B9A",
                        }}
                      >
                        ✓ Đã xác nhận thanh toán
                      </div>
                    )}

                    {/* Payment action */}
                    {isPaymentProcessing && !isDone && (
                      <div
                        style={{
                          marginTop: 12,
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {/* Image picker */}
                        <button
                          style={{
                            width: "100%",
                            border: "1.5px dashed #16a34a",
                            borderRadius: 10,
                            padding: 10,
                            background: hasPayImg ? "#dcfce7" : "#fff",
                            color: "#16a34a",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden",
                          }}
                          onClick={() =>
                            handleChoosePayImage(inv._id, inv.totalAmount)
                          }
                        >
                          {hasPayImg ? (
                            <div style={{ position: "relative" }}>
                              <img
                                src={payImg!.url}
                                alt="receipt"
                                style={{
                                  width: "100%",
                                  maxHeight: 140,
                                  borderRadius: 8,
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                              {aiStatus !== "idle" && (
                                <div
                                  style={{
                                    position: "absolute",
                                    inset: 0,
                                    borderRadius: 8,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background:
                                      aiStatus === "checking"
                                        ? "rgba(0,0,0,0.55)"
                                        : aiStatus === "valid"
                                          ? "rgba(27,141,50,0.82)"
                                          : "rgba(198,40,40,0.82)",
                                  }}
                                >
                                  {aiStatus === "checking" ? (
                                    <span
                                      style={{
                                        color: "#fff",
                                        fontSize: 13,
                                        fontWeight: 700,
                                      }}
                                    >
                                      ⚙ AI đang kiểm tra...
                                    </span>
                                  ) : (
                                    <>
                                      <span
                                        style={{
                                          fontSize: 30,
                                          color: "#fff",
                                          fontWeight: 700,
                                        }}
                                      >
                                        {aiStatus === "valid" ? "✓" : "✕"}
                                      </span>
                                      <span
                                        style={{
                                          color: "#fff",
                                          fontSize: 11,
                                          fontWeight: 700,
                                          marginTop: 4,
                                          padding: "0 8px",
                                          textAlign: "center",
                                        }}
                                      >
                                        {aiMessage}
                                      </span>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : inv.transactionImage ? (
                            <img
                              src={inv.transactionImage}
                              alt="receipt"
                              style={{
                                width: "100%",
                                maxHeight: 140,
                                borderRadius: 8,
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                          ) : (
                            "📎 Đính kèm ảnh chuyển khoản"
                          )}
                        </button>

                        {/* Re-check button */}
                        {hasPayImg && aiStatus === "invalid" && (
                          <button
                            style={{
                              width: "100%",
                              border: "1px solid #E65100",
                              borderRadius: 10,
                              padding: "8px 0",
                              background: "#fff",
                              color: "#E65100",
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              runAICheck(payImg!.url, inv._id, inv.totalAmount)
                            }
                          >
                            Kiểm tra lại với AI
                          </button>
                        )}

                        <Button
                          fullWidth
                          loading={confirming}
                          disabled={confirming || aiStatus === "checking"}
                          style={{
                            background:
                              "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                            color: "#fff",
                            borderRadius: 12,
                            height: 46,
                            fontSize: 14,
                            fontWeight: 600,
                            border: "none",
                          }}
                          onClick={() => handleConfirmPayment(inv._id)}
                        >
                          Xác nhận đã thanh toán
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === "history" && (
          <>
            {invoicesLoading ? (
              <Box className="flex flex-col items-center py-12">
                <Text className="text-gray-400">Đang tải...</Text>
              </Box>
            ) : historyInvoices.length === 0 ? (
              <Box className="flex flex-col items-center py-12 space-y-3">
                <Text className="text-gray-400 text-center">
                  Chưa có lịch sử thanh toán
                </Text>
                <button
                  style={{
                    color: "#16a34a",
                    fontSize: 13,
                    background: "none",
                    border: "none",
                    textDecoration: "underline",
                  }}
                  onClick={fetchInvoices}
                >
                  Tải lại
                </button>
              </Box>
            ) : (
              historyInvoices.map((inv) => {
                const isExpanded = expandedId === inv._id;
                return (
                  <div
                    key={inv._id}
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      padding: 16,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        cursor: "pointer",
                      }}
                      onClick={() => setExpandedId(isExpanded ? null : inv._id)}
                    >
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: 16,
                            margin: 0,
                            color: "#1a1a1a",
                          }}
                        >
                          {inv.roomId?.roomName || "Phòng"}
                        </p>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#666",
                            margin: "2px 0 0",
                          }}
                        >
                          {inv.roomId?.houseId?.houseName || "Nhà trọ"}
                        </p>
                        <p
                          style={{
                            fontSize: 11,
                            color: "#999",
                            margin: "2px 0 0",
                          }}
                        >
                          {inv.createDate
                            ? new Date(inv.createDate).toLocaleDateString(
                                "vi-VN",
                              )
                            : ""}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: "#E8F5E9",
                          color: "#2E7D32",
                        }}
                      >
                        ĐÃ HOÀN THÀNH
                      </span>
                    </div>

                    {isExpanded && renderBreakdown(inv)}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: 10,
                        marginTop: 8,
                      }}
                    >
                      <span style={{ fontWeight: 700, color: "#333" }}>
                        Tổng cộng
                      </span>
                      <span
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: "#16a34a",
                        }}
                      >
                        {fmt(inv.totalAmount)}
                      </span>
                    </div>

                    {inv.transactionImage && isExpanded && (
                      <div style={{ marginTop: 10 }}>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#666",
                            margin: "0 0 6px",
                          }}
                        >
                          Ảnh chuyển khoản:
                        </p>
                        <img
                          src={inv.transactionImage}
                          alt="receipt"
                          style={{
                            width: "100%",
                            maxHeight: 160,
                            borderRadius: 10,
                            objectFit: "contain",
                            background: "#f5f5f5",
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}
      </Box>
    </Page>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function MeterCard({
  type,
  field,
  onChange,
  onChooseImage,
}: {
  type: "water" | "electric";
  field: MeterField;
  onChange: (v: string) => void;
  onChooseImage: () => void;
}) {
  const isWater = type === "water";
  const color = isWater ? "#16a34a" : "#ca8a04";
  const border = isWater ? "#bbf7d0" : "#fde68a";
  const bg = isWater ? "#f0fdf4" : "#fffbeb";
  const imgBg = isWater ? "#dcfce7" : "#fef3c7";

  return (
    <Box
      className="rounded-2xl p-4 space-y-3"
      style={{ border: `2px solid ${border}`, background: bg }}
    >
      <Box className="flex items-center space-x-2 mb-1">
        {isWater ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C12 2 5 9.5 5 14a7 7 0 0014 0C19 9.5 12 2 12 2z"
              stroke={color}
              strokeWidth="2"
              fill={border}
            />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M13 2L4.5 13.5H12L11 22L19.5 10.5H12L13 2z"
              stroke={color}
              strokeWidth="2"
              fill={border}
              strokeLinejoin="round"
            />
          </svg>
        )}
        <Text
          className="font-semibold"
          style={{ color: isWater ? "#166534" : "#92400e" }}
        >
          {isWater ? "Chỉ số nước" : "Chỉ số điện"}
        </Text>
      </Box>
      <Input
        type="number"
        placeholder={isWater ? "Nhập số nước (m³)" : "Nhập số điện (kWh)"}
        value={field.value}
        onChange={(e) => onChange(e.target.value)}
        style={{ borderColor: color, background: "#fff", color: "#111" }}
      />
      <button
        className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl text-sm font-medium"
        style={{
          border: `1.5px dashed ${color}`,
          background: field.imageUrl ? imgBg : "#fff",
          color,
        }}
        onClick={onChooseImage}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect
            x="2"
            y="6"
            width="20"
            height="14"
            rx="2"
            stroke={color}
            strokeWidth="1.8"
          />
          <circle cx="12" cy="13" r="3.5" stroke={color} strokeWidth="1.8" />
          <path d="M8 6V5a2 2 0 014 0v1" stroke={color} strokeWidth="1.8" />
        </svg>
        <span>
          {field.imageUrl
            ? "Đã chụp ảnh ✓"
            : isWater
              ? "Chụp / chọn ảnh đồng hồ nước"
              : "Chụp / chọn ảnh đồng hồ điện"}
        </span>
      </button>
      {field.imageUrl && (
        <img
          src={field.imageUrl}
          alt="meter"
          className="w-full rounded-xl object-cover"
          style={{ maxHeight: 160 }}
        />
      )}
    </Box>
  );
}

function ResultBox({
  success,
  title,
  sub,
  onAction,
  actionLabel,
}: {
  success: boolean;
  title: string;
  sub: string;
  onAction: () => void;
  actionLabel: string;
}) {
  return (
    <Box className="flex flex-col items-center py-12 space-y-4">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: success ? "#dcfce7" : "#fce3dc" }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          {success ? (
            <path
              d="M5 13l4 4L19 7"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="#ff0000"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </div>
      <Text.Title
        size="large"
        className={
          success ? "!text-green-700 font-bold" : "!text-red-700 font-bold"
        }
      >
        {title}
      </Text.Title>
      <Text className="text-gray-500 text-center text-sm">{sub}</Text>
      <Button
        style={{ background: "#16a34a", color: "#fff", marginTop: 16 }}
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </Box>
  );
}

export default HomePage;
