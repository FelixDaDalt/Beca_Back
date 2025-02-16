const { exec } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');

// Detectar NODE_ENV y seleccionar el archivo .env adecuado
const envFile = `.env.${process.env.NODE_ENV || 'local'}`;
dotenv.config({ path: path.resolve(__dirname, envFile) });

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT } = process.env;

if (!DB_PASSWORD) {
    console.error('❌ ERROR: La variable DB_PASSWORD no está definida en', envFile);
    process.exit(1);
}

const command = `npx sequelize-auto -o "./src/models" -d ${DB_NAME} -h ${DB_HOST} -u ${DB_USER} -x "${DB_PASSWORD}" -e ${DB_DIALECT} -l ts`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`❌ Error ejecutando sequelize-auto: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`⚠️ Advertencia: ${stderr}`);
    }
    console.log(`✅ Modelos actualizados correctamente:\n${stdout}`);
});
