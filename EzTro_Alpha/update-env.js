const os = require("os");
const fs = require("fs");
const path = require("path");

const interfaces = os.networkInterfaces();
let ip = "";

for (const iface of interfaces["Wi-Fi"] || []) {
  if (iface.family === "IPv4" && !iface.internal) {
    ip = iface.address;
    break;
  }
}

const envPath = path.resolve(".env");
const content = ip ? `EXPO_PUBLIC_SERVER_URI=http://${ip}:8080/` : "EXPO_PUBLIC_SERVER_URI=http://localhost:8080/";

try {
  fs.writeFileSync(envPath, content, { encoding: "utf8" });
} catch (err) {}
