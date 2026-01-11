-- 🚨 SEED EDITABLE MANUAL 🚨
-- Stores the manual content in app_settings so it can be edited.

INSERT INTO public.app_settings (key, value)
VALUES (
    'manual_gra',
    '{
        "title": "OPERAÇÕES AÉREAS",
        "subtitle": "GRUPO DE RESGATE E APOIO AÉREO",
        "modules": [
            {
                "title": "Hierarquia e Responsabilidade",
                "content": "Operamos com tripulação única (P1). A autonomia é total, mas a responsabilidade é absoluta.\\n\\n• Cadeia de Comando: Comando Geral > Sub-Comando > Piloto (Você).\\n• Autoridade na Aeronave: Se o motor está ligado, o piloto manda. Se o piloto diz \"não dá pra pousar\", a ordem é final. A segurança da aeronave e da vida vem antes de qualquer patente."
            },
            {
                "title": "Procedimentos Pré-Voo (Checklist)",
                "content": "Garantia de que a máquina não vai falhar no meio do tiroteio.\\n\\n• Lataria e Hélices: Inspeção visual rápida. Sem fumaça preta ou faíscas visíveis.\\n• Combustível: Decolagem permitida APENAS com tanque cheio (100%).\\n• Equipamentos: Rádio sintonizado na frequência prioritária. Câmera Térmica operante."
            },
            {
                "title": "Comunicação Tática (Qru Visual)",
                "content": "Você é os \"olhos de Deus\". Sua comunicação deve pintar um quadro claro para quem está no chão.\\n\\nERRADO: \"Acho que ele virou ali na rua da loja rosa...\"\\nCERTO: \"QTH: Vinewood Blvd. Direção NORTE. Veículo preto em alta velocidade.\"\\n\\nUse pontos cardeais e referências fixas (bancos, praças, avenidas principais)."
            },
            {
                "title": "Técnicas de Perseguição",
                "content": "O objetivo não é apenas seguir, é antecipar.\\n\\n• Altitude de Cruzeiro: Alto o suficiente para evitar colisão com prédios, baixo o suficiente para não perder o visual.\\n• Curva de Órbita: Nunca pare o helicóptero (hover) sobre o alvo. Voe em círculos largos para manter inércia.\\n• Predição: O helicóptero é mais rápido que o carro no trajeto direto. Corte caminho pelas diagonais."
            },
            {
                "title": "Gerenciamento de Combustível",
                "content": "A regra de ouro: Aeronave sem combustível vira um tijolo de 2 toneladas.\\n\\n• 50% de Tanque: Reporte obrigatório no rádio (\"Águia com 50% de autonomia\").\\n• 25% de Tanque (BIN-GO): Abortar missão imediatamente. Retorno à base para reabastecimento.\\n• Pane Seca: Queda por falta de combustível resulta em Exulsão Imediata do GRA."
            },
            {
                "title": "Regras de Engajamento",
                "content": "• Disparos: PROIBIDO atirar pilotando. Exceção: Código Vermelho autorizado pelo Comando Maior.\\n• Pouso em Ocorrência: Apenas em duas situações: Resgate Tático de oficial abatido (\"Officer Down\") ou Área segura (Code 4)."
            }
        ]
    }'::jsonb
)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value;

-- Also update the course link to the new internal route
UPDATE public.courses
SET pdf_url = '/manual/gra'
WHERE id = 'gra';
