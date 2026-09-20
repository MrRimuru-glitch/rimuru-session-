const { default: makeWASocket, useMultiFileAuthState, delay } = require("@whiskeysockets/baileys")
const pino = require("pino")

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("auth")
  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state,
    printQRInTerminal: false
  })
  sock.ev.on("creds.update", saveCreds)
  
  if (!state.creds.registered) {
    await delay(3000)
    let number = "2349068175448" // your number
    let code = await sock.requestPairingCode(number)
    console.log("YOUR PAIR CODE IS: " + code)
    console.log("Go WhatsApp > Linked Devices > Link with phone number > Type this code!")
  }
  
  sock.ev.on("connection.update", async (s) => {
    if (s.connection === "open") {
      console.log("CONNECTED! Now check folder auth/creds.json")
    }
  })
}
start()
