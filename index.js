const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode");
const qrcodeTerminal = require("qrcode-terminal");
const { exec } = require("child_process");
const waState = require("./waState");

const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {},
  authStrategy: new LocalAuth({
    clientId: "client-one",
    dataPath: "./auth_data",
  }),
});

// Event untuk menampilkan QR Code
client.on("qr", (qr) => {
  console.log("QR RECEIVED");
  qrcodeTerminal.generate(qr, { small: true }); // Tampilkan di terminal
  
  // Simpan QR sebagai data URL agar bisa ditampilkan di website
  qrcode.toDataURL(qr, { errorCorrectionLevel: 'H' }, (err, url) => {
    if (!err) {
      waState.qr = url;
      waState.status = "Waiting for scan";
    }
  });
});

client.on("ready", () => {
  console.log("WhatsApp is ready!");
  waState.status = "WhatsApp is ready!";
  waState.qr = null; // Hapus QR setelah login
});

client.on("authenticated", () => {
  console.log("WhatsApp is authenticated!");
  waState.status = "Authenticated";
});

client.on("auth_failure", (msg) => {
  console.error("Authentication failed:", msg);
  waState.status = "Authentication failed";
});

client.on("disconnected", (reason) => {
  console.log("WhatsApp is disconnected:", reason);
  waState.status = "Disconnected";
  client.initialize(); // Coba reconnect
});

// Menangani pesan masuk
client.on("message", async (msg) => {
  if (msg.body.startsWith("/ping")) {
    msg.reply("pong");
  }
});

// Inisialisasi client WhatsApp
client.initialize();
