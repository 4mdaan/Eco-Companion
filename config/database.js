const mysql = require('mysql2/promise');

// Configuração da conexão com MySQL
const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || '127.0.0.1',
      port: Number(process.env.MYSQL_PORT) || 3306,
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'eco_companion',
      connectTimeout: 10000,
      timezone: 'Z'
    });

    console.log(`✅ MySQL conectado: ${process.env.MYSQL_USER || 'root'}@${process.env.MYSQL_HOST || '127.0.0.1'}:${process.env.MYSQL_PORT || 3306}/${process.env.MYSQL_DATABASE || 'eco_companion'}`);
    return connection;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MySQL:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;