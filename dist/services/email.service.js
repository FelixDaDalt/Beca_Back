"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarCorreo = enviarCorreo;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Configurar el transporte con Gmail SMTP
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "rib.notificacion@gmail.com", // Reemplaza con tu correo
        pass: "yakr mgkr xmhu lyzb", // Reemplaza con tu contraseña de aplicación
    },
});
/**
 * Función para enviar un correo
 * @param to - Correo del destinatario
 * @param subject - Asunto del correo
 * @param text - Mensaje en texto plano
 * @param html - Mensaje en HTML (opcional)
 */
async function enviarCorreo(to, subject, text, html) {
    try {
        const mensajeAdicional = "\n\nVisitar: https://rib.tecnohilet.com.ar/ para más información.\nNo responder a este correo.";
        const info = await transporter.sendMail({
            from: '"Rib Notificacion" <rib.notificacion@gmail.com>', // Nombre y correo del remitente
            to, // Correo del destinatario
            subject, // Asunto
            text: text + mensajeAdicional, // Agregar mensaje adicional al texto plano
            html: (html || text).replace(/\n/g, "<br>") + `<br><br>Visitar: <a href="https://rib.tecnohilet.com.ar/">rib.tecnohilet.com.ar</a> para más información.<br>No responda este email.`, // Agregar mensaje adicional al HTML
        });
        console.log("📩 Correo enviado:", info.messageId);
        return info;
    }
    catch (error) {
        console.error("❌ Error enviando correo:", error);
        throw error;
    }
}
