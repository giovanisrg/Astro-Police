-- SEED FINAL MANUALS (The "Gold Standard" Edition)
-- REPLICATING EXACT CONTENT from gra_manual_old.html
-- EXTENDING same quality to SWAT, GTM, SPEED

-- ==========================================
-- 1. GRA (Grupo de Resgate e Apoio Aéreo)
-- ==========================================
INSERT INTO public.app_settings (key, value, updated_at)
VALUES (
  'manual_gra',
  '{
    "title": "OPERAÇÕES AÉREAS",
    "subtitle": "GRUPO DE RESGATE E APOIO AÉREO",
    "modules": [
      {
        "title": "Hierarquia e Responsabilidade",
        "content": "Operamos com tripulação única (P1). A autonomia é total, mas a responsabilidade é absoluta.\n\n[INFO]\n- **Cadeia de Comando:** Comando Geral > Sub-Comando > Piloto (Você).\n- **Autoridade na Aeronave:** Se o motor está ligado, o piloto manda. Se o piloto diz \"não dá pra pousar\", a ordem é final. A segurança da aeronave e da vida vem antes de qualquer patente."
      },
      {
        "title": "Procedimentos Pré-Voo (Checklist)",
        "content": "Garantia de que a máquina não vai falhar no meio do tiroteio.\n\n- **Lataria e Hélices:** Inspeção visual rápida. Sem fumaça preta ou faíscas visíveis.\n- **Combustível:** Decolagem permitida APENAS com tanque cheio (100%).\n- **Equipamentos:** Rádio sintonizado na frequência prioritária. Câmera Térmica operante."
      },
      {
        "title": "Comunicação Tática (Qru Visual)",
        "content": "Você é os \"olhos de Deus\". Sua comunicação deve pintar um quadro claro para quem está no chão.\n\n[WARNING]\n**ERRADO:** \"Acho que ele virou ali na rua da loja rosa...\"\n**CERTO:** \"QTH: Vinewood Blvd. Direção NORTE. Veículo preto em alta velocidade.\"\n\nUse pontos cardeais e referências fixas (bancos, praças, avenidas principais)."
      },
      {
        "title": "Técnicas de Perseguição",
        "content": "O objetivo não é apenas seguir, é antecipar.\n\n- **Altitude de Cruzeiro:** Alto o suficiente para evitar colisão com prédios, baixo o suficiente para não perder o visual.\n- **Curva de Órbita:** Nunca pare o helicóptero (hover) sobre o alvo. Voe em círculos largos para manter inércia.\n- **Predição:** O helicóptero é mais rápido que o carro no trajeto direto. Corte caminho pelas diagonais."
      },
      {
        "title": "Gerenciamento de Combustível",
        "content": "A regra de ouro: Aeronave sem combustível vira um tijolo de 2 toneladas.\n\n[INFO]\n- **50% de Tanque:** Reporte obrigatório no rádio (\"Águia com 50% de autonomia\").\n- **25% de Tanque (BIN-GO):** Abortar missão imediatamente. Retorno à base para reabastecimento.\n- **Pane Seca:** Queda por falta de combustível resulta em **Expulsão Imediata** do GRA."
      },
      {
        "title": "Regras de Engajamento",
        "content": "- **Disparos:** PROIBIDO atirar pilotando. Exceção: Código Vermelho autorizado pelo Comando Maior.\n- **Pouso em Ocorrência:** Apenas em duas situações:\n  1. Resgate Tático de oficial abatido (\"Officer Down\").\n  2. Área segura (Code 4) para extração ou apoio."
      }
    ]
  }'::jsonb,
  NOW()
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();


-- ==========================================
-- 2. SWAT (Special Weapons and Tactics)
-- ==========================================
INSERT INTO public.app_settings (key, value, updated_at)
VALUES (
  'manual_swat',
  '{
    "title": "TÁTICAS ESPECIAIS",
    "subtitle": "SPECIAL WEAPONS AND TACTICS",
    "modules": [
      {
        "title": "Filosofia Operacional",
        "content": "Salvar vidas é a prioridade absoluta. A neutralização da ameaça é o meio, não o fim.\n\n[INFO]\n- **Velocidade:** Surpreender o inimigo.\n- **Agressividade:** Controlar o ambiente instantaneamente.\n- **Precisão:** Eliminar a ameaça sem danos colaterais."
      },
      {
        "title": "CQB (Combate em Ambiente Confinado)",
        "content": "O domínio do espaço em quartos, corredores e escadas.\n\n- **Fatiamento (Slicing the Pie):** Exponha-se apenas o suficiente para ver o alvo.\n- **Entrada Dinâmica:** Invasão rápida e violenta para atordoar (Flashbang + Entrada).\n- **Entrada Furtiva:** Movimentação lenta e silenciosa para reconhecimento."
      },
      {
        "title": "Funções na Equipe",
        "content": "Cada operador é uma engrenagem vital.\n\n1. **Pointman (Ponta):** Primeiro a entrar, leitura de perigo imediato.\n2. **Team Leader (Líder):** Coordena a ação e comunicação.\n3. **Breacher (Arrombador):** Responsável por abrir portas (C4, Shotgun, Ariete).\n4. **Rear Guard (Retaguarda):** Cobre as costas do time."
      },
      {
        "title": "Uso de Escudo Balístico",
        "content": "A muralha móvel da equipe.\n\n[WARNING]\n**Proteção:** O escudo protege contra armas leves. Fuzis podem perfurar dependendo do calibre.\n**Mobilidade:** O portador do escudo dita a velocidade do time. Nunca o ultrapasse sem ordem."
      },
      {
        "title": "Regras de Engajamento (ROE)",
        "content": "Quando disparar e quando segurar.\n\n- **Ameaça Iminente:** Suspeito aponta arma -> Disparo autorizado.\n- **Rendição:** Suspeito larga arma e levanta mãos -> Disparo PROIBIDO.\n- **Fogo Cruzado:** Cuidado extremo com companheiros na linha de tiro."
      }
    ]
  }'::jsonb,
  NOW()
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();


-- ==========================================
-- 3. GTM (Grupo Tático de Motociclistas)
-- ==========================================
INSERT INTO public.app_settings (key, value, updated_at)
VALUES (
  'manual_gtm',
  '{
    "title": "PATRULHAMENTO TÁTICO",
    "subtitle": "GRUPO TÁTICO DE MOTOCICLISTAS",
    "modules": [
      {
        "title": "Doutrina ROCAM",
        "content": "Agilidade superior, resposta imediata. Onde a viatura para, a moto avança.\n\n[INFO]\n- **Binômio:** Atuação sempre em duplas. Uma moto cobre a outra.\n- **Vantagem:** Acesso a becos, escadarias e terrenos acidentados."
      },
      {
        "title": "Técnicas de Pilotagem Urbana",
        "content": "Sobrevivência no trânsito caótico.\n\n- **Corredor Tático:** Uso eficiente do espaço entre veículos.\n- **Frenagem de Emergência:** Uso combinado de freio motor e traseiro. Evitar travamento do dianteiro em curvas.\n- **Contra-esterço:** Curvas rápidas exigem técnica, não apenas inclinação."
      },
      {
        "title": "Abordagem com Motocicleta",
        "content": "O momento de maior vulnerabilidade.\n\n[WARNING]\n**Posicionamento:** Nunca pare na frente ou atrás do veículo. Pare na diagonal traseira (Zona Cega).\n**Desembarque:** Moto no pezinho, chave na ignição (se precisar sair rápido), arma em punho imediato."
      },
      {
        "title": "Escolta VIP e Cargas",
        "content": "Garantindo a segurança do deslocamento.\n\n- **Batedor Avançado:** Bloqueia o cruzamento antes do comboio chegar.\n- **Cerra-Fila:** Impede que veículos civis entrem no meio do comboio.\n- **Efeito Sanfona:** Manter distância para não colidir em frenagens bruscas."
      },
      {
        "title": "Combate Embarcado",
        "content": "O uso de armamento enquanto pilota.\n\n- **Pistola:** Única arma permitida em movimento.\n- **Garupa (Se houver):** Responsável pelo fogo de supressão de fuzil/SMG.\n- **Prioridade:** Pilotar primeiro, atirar depois. Moto no chão não persegue ninguém."
      }
    ]
  }'::jsonb,
  NOW()
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();


-- ==========================================
-- 4. SPEED (Interceptação Veicular)
-- ==========================================
INSERT INTO public.app_settings (key, value, updated_at)
VALUES (
  'manual_speed',
  '{
    "title": "INTERCEPTAÇÃO VEICULAR",
    "subtitle": "DIVISÃO DE ALTA VELOCIDADE",
    "modules": [
      {
        "title": "A Máquina e o Piloto",
        "content": "Não basta ter um carro rápido, é preciso ter a mente rápida.\n\n[INFO]\n- **Manutenção:** Pneus, freios e motor devem estar em 100%.\n- **Física:** Entenda transferência de peso. Frear antes da curva, acelerar na saída."
      },
      {
        "title": "Traçado de Perseguição",
        "content": "Como encurtar a distância.\n\n- **Antecipação:** Olhe para onde você quer ir, não para o carro da frente.\n- **Tangência:** Corte as curvas por dentro para manter velocidade.\n- **Vácuo:** Cole na traseira para ganhar impulso extra (Drafting)."
      },
      {
        "title": "Manobra PIT (Precision Immobilization Technique)",
        "content": "A arte de desestabilizar.\n\n[WARNING]\n**Zona de Contato:** Para-lama dianteiro seu, no para-lama traseiro dele.\n**Velocidade:** Ideal abaixo de 130km/h. Acima disso é letal.\n**Execução:** Toque suave e vire o volante para o lado do alvo."
      },
      {
        "title": "Cerco e Bloqueio (Roadblock)",
        "content": "Parando o imparável.\n\n- **Estático:** Viaturas atravessadas na pista (apenas em retas com visibilidade).\n- **Móvel (Rolling Block):** Viaturas à frente diminuindo velocidade gradualmente.\n- **Spikes:** Uso de tapetes de pregos. Requer comunicação perfeita para não atingir aliados."
      },
      {
        "title": "O Código de Alta Velocidade",
        "content": "Quando abortar?\n\n1. **Área Escolar/Pedestres:** Risco inaceitável.\n2. **Danos Críticos:** Viatura saindo fumaça ou pneu furado = Fim da linha.\n3. **Perda Visual:** Se o GRA ou outra unidade não tem visual, não adivinhe."
      }
    ]
  }'::jsonb,
  NOW()
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- 5. FINAL UPDATE OF URLS
-- Ensuring everything points to the new system
UPDATE public.courses SET pdf_url = '/manual/gra' WHERE nome ILIKE '%GRA%';
UPDATE public.courses SET pdf_url = '/manual/swat' WHERE nome ILIKE '%SWAT%';
UPDATE public.courses SET pdf_url = '/manual/gtm' WHERE nome ILIKE '%GTM%' OR nome ILIKE '%Motos%';
UPDATE public.courses SET pdf_url = '/manual/speed' WHERE nome ILIKE '%SPEED%' OR nome ILIKE '%Interceptação%';
