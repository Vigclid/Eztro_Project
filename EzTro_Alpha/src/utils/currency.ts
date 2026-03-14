export function formatCurrencyVND(amount: number | null | undefined): string {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return "0 ₫";
    }

    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}