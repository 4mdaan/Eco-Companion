const express = require('express');
const router = express.Router();

// Rota para Política de Privacidade
router.get('/privacidade', (req, res) => {
    res.render('legal/privacidade', {
        title: 'Política de Privacidade - Eco Companion',
        currentPage: 'privacidade'
    });
});

// Rota para Termos de Uso
router.get('/termos', (req, res) => {
    res.render('legal/termos', {
        title: 'Termos de Uso - Eco Companion',
        currentPage: 'termos'
    });
});

// Rota para Política de Cookies
router.get('/cookies', (req, res) => {
    res.render('legal/cookies', {
        title: 'Política de Cookies - Eco Companion',
        currentPage: 'cookies'
    });
});

// Rota para Segurança
router.get('/seguranca', (req, res) => {
    res.render('legal/seguranca', {
        title: 'Segurança - Eco Companion',
        currentPage: 'seguranca'
    });
});

module.exports = router;