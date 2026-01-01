// ==================================================================================
// CONFIGURAÇÃO DE WEBHOOKS DO DISCORD
// ==================================================================================
// Aqui você define para onde os alertas de matrícula devem ir.
// Crie Webhooks no seu Discord em: Editar Canal -> Integrações -> Webhooks -> Novo Webhook
// Copie a URL do Webhook e cole abaixo.
// ==================================================================================

export const WEBHOOK_CONFIG = {
    // Canal para Cursos Obrigatórios (CBF, CAPE, etc.)
    GERAL: "https://discord.com/api/webhooks/1455617875443454022/RND8X9HjjVoLJhUmX1j75E0Lhpx3wYA5YHYc4iMOESkqwctm-ERopfHyDJ9X0dI29HwS",

    // Webhooks para o Sistema de Recrutamento
    RECRUTAMENTO_APTO: "https://discord.com/api/webhooks/1323319086884618335/O2o5Z2gJ0VwRk7M-Fk4C_v_D3sQ3a6g8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q",
    RECRUTAMENTO_INAPTO: "https://discord.com/api/webhooks/1323321591890661479/Z2o5Z2gJ0VwRk7M-Fk4C_v_D3sQ3a6g8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q",
    RECRUTAMENTO_LN: "https://discord.com/api/webhooks/1455980379369377795/JyNna-m2WLnoo3PUS_jF58XF4u2y_YB908HNvBho8jbVGf-71irKPOfAYGgRGqDI_jVg", // Novo Webhook para Lista NegrajsGLT3TXb1JtNMUd06rTWx_lIl3rFMZyJmnRWPeJI6WoZmxBJwrXX0Tb",

    // Canais Específicos por Guarnição
    GUARNICOES: {
        GRA: "https://discord.com/api/webhooks/1455618826262806642/96rcSVTt84jRSlSDK_bj8VrLSksajEkeU1UznwpkorNWdXdh5je49vIoBYWRPyntCOxx",
        SWAT: "https://discord.com/api/webhooks/1455618940935078073/Guff5ZHbHL2b2ehkqXIuzOQiGHxqkpRPqGCM7Rl3dQo7ns9W5fkP_QPdzVKpJjMzsiqQ",
        GTM: "https://discord.com/api/webhooks/1456401779523584204/IaNMY3RDsTbfdKu0j89QNuI1Kg4RjFgWYxCc858roWOcOG60JRYwEcVOoKxBOl3QQ7Fq",
        SPEED: "https://discord.com/api/webhooks/1455618651582500926/TcCsSJd6vsmVTIF5ZwI1Nj9momn2BuGNd4rPa0rn09wFgWawpBX--OsFT1zV4mo5WU8w"
    }
};

export const getWebhookUrl = (guarnicao?: string) => {
    // Se tiver guarnição definida (ex: "GRA"), tenta pegar o webhook específico
    if (guarnicao && guarnicao in WEBHOOK_CONFIG.GUARNICOES) {
        return WEBHOOK_CONFIG.GUARNICOES[guarnicao as keyof typeof WEBHOOK_CONFIG.GUARNICOES];
    }
    // Se não, manda no geral
    return WEBHOOK_CONFIG.GERAL;
};
