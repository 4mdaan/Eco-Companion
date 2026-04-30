const mongoose = require('mongoose');

// Configuração da conexão com MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eco-companion', {
      // Pool de Conexões
      maxPoolSize: 10, // Máximo de conexões simultâneas
      minPoolSize: 5, // Mínimo de conexões mantidas
      
      // Timeouts
      serverSelectionTimeoutMS: 5000, // Timeout para seleção do servidor
      socketTimeoutMS: 45000, // Timeout do socket
      connectTimeoutMS: 10000, // Timeout de conexão
      
      // Retry automático
      retryWrites: true, // Retry automático de writes
      retryReads: true, // Retry automático de reads
      
      // Heartbeat e monitoramento
      heartbeatFrequencyMS: 10000, // Check de saúde a cada 10s
      serverMonitoringMode: 'auto', // Monitoramento automático
      
      // Rede
      family: 4 // Usar IPv4
    });

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Pool: ${conn.connection.getClient().topology.s.pool?.totalConnectionCount || 'N/A'} conexões`);
    
    return conn;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

// Monitorar eventos de conexão
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB desconectado');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconectado');
});

module.exports = connectDB;