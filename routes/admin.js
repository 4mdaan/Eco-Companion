const express = require('express');
const router = express.Router();

// Dashboard de Administração e Monitoramento
router.get('/dashboard', (req, res) => {
  // Simular dados de monitoramento
  const dashboardData = {
    // Métricas de Performance
    performance: {
      responseTime: '89ms',
      uptime: '99.9%',
      requests: 15420,
      errors: 12,
      loadTime: '1.2s'
    },
    
    // Estatísticas de Usuários
    users: {
      online: 127,
      today: 2847,
      thisMonth: 89456,
      conversion: '12.8%'
    },
    
    // Status das Integrações
    integrations: {
      booking: { status: 'online', latency: '45ms', requests: 1247 },
      payment: { status: 'online', latency: '23ms', requests: 892 },
      weather: { status: 'online', latency: '156ms', requests: 445 },
      analytics: { status: 'online', latency: '67ms', requests: 2341 }
    },
    
    // Segurança
    security: {
      ssl: true,
      firewall: 'active',
      threats: 3,
      blocked: 89
    },
    
    // Automação
    automation: {
      emails: { sent: 2456, delivered: 2398, opened: 1876 },
      notifications: { sent: 1234, clicked: 987 },
      backups: { last: '2 horas atrás', status: 'success' }
    },
    
    // Reviews e Feedback
    reviews: {
      total: 2847,
      average: 4.9,
      recent: [
        { name: 'Ana Silva', rating: 5, text: 'Excelente serviço!', time: '2min' },
        { name: 'João Santos', rating: 5, text: 'Recomendo!', time: '5min' },
        { name: 'Maria Costa', rating: 4, text: 'Muito bom!', time: '8min' }
      ]
    }
  };

  res.render('admin/dashboard', {
    title: 'Dashboard Administrativo',
    description: 'Monitoramento em tempo real do sistema',
    data: dashboardData
  });
});

// API para dados em tempo real do dashboard
router.get('/api/dashboard/realtime', (req, res) => {
  // Simular dados em tempo real
  const realtimeData = {
    timestamp: new Date().toISOString(),
    activeUsers: Math.floor(Math.random() * 50) + 100,
    responseTime: Math.floor(Math.random() * 50) + 50 + 'ms',
    requests: Math.floor(Math.random() * 100) + 15400,
    conversion: (Math.random() * 5 + 10).toFixed(1) + '%',
    newReview: Math.random() > 0.7 ? {
      name: ['Ana Silva', 'João Santos', 'Maria Costa'][Math.floor(Math.random() * 3)],
      rating: Math.floor(Math.random() * 2) + 4,
      destination: ['Rio de Janeiro', 'Gramado', 'Florianópolis'][Math.floor(Math.random() * 3)]
    } : null
  };
  
  res.json(realtimeData);
});

// Logs de Segurança
router.get('/security/logs', (req, res) => {
  const securityLogs = [
    {
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      type: 'login',
      message: 'Login bem-sucedido',
      ip: '192.168.1.100',
      severity: 'info'
    },
    {
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      type: 'firewall',
      message: 'Tentativa de ataque SQL injection bloqueada',
      ip: '185.220.101.42',
      severity: 'high'
    },
    {
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      type: 'ssl',
      message: 'Certificado SSL renovado automaticamente',
      ip: 'system',
      severity: 'info'
    }
  ];

  res.json(securityLogs);
});

// Status das Integrações
router.get('/integrations/status', (req, res) => {
  const integrationStatus = {
    booking: {
      status: Math.random() > 0.1 ? 'online' : 'warning',
      uptime: '99.8%',
      avgResponse: Math.floor(Math.random() * 100) + 50 + 'ms',
      requests24h: 15420
    },
    payment: {
      status: Math.random() > 0.05 ? 'online' : 'warning',
      uptime: '99.9%',
      avgResponse: Math.floor(Math.random() * 50) + 20 + 'ms',
      requests24h: 8920
    },
    weather: {
      status: Math.random() > 0.2 ? 'online' : 'warning',
      uptime: '98.5%',
      avgResponse: Math.floor(Math.random() * 200) + 100 + 'ms',
      requests24h: 4450
    },
    analytics: {
      status: 'online',
      uptime: '100%',
      avgResponse: Math.floor(Math.random() * 100) + 30 + 'ms',
      requests24h: 23410
    }
  };

  res.json(integrationStatus);
});

module.exports = router;