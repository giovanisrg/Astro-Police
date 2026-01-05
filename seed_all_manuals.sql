-- SEED COMPLETE MANUALS for GRA, SWAT, GTM, SPEED
-- Using the new formatting syntax: **bold**, - list, [INFO], [WARNING]

-- 1. GRA (Grupo de Resgate e Apoio Aéreo)
INSERT INTO public.app_settings (key, value, updated_at)
VALUES (
  'manual_gra',
  '{
    "title": "OPERAÇÕES AÉREAS",
    "subtitle": "GRUPO DE RESGATE E APOIO AÉREO",
    "modules": [
      {
        "title": "Hierarquia e Responsabilidade",
        "content": "Operamos com tripulação única (P1). A autonomia é total, mas a responsabilidade é absoluta.\n\n[INFO]\n- **Cadeia de Comando:** Comando Geral > Sub-Comando > Piloto (Você).\n- **Autoridade na Aeronave:** Se o motor está ligado, o piloto manda. Se o piloto diz \"não dá pra pousar\", a ordem é final."
      },
      {
        "title": "Procedimentos Pré-Voo (Checklist)",
        "content": "Garantia de que a máquina não vai falhar no meio do tiroteio.\n\n- **Lataria e Hélices:** Inspeção visual rápida. Sem fumaça preta ou faíscas visíveis.\n- **Combustível:** Decolagem permitida APENAS com tanque cheio (100%).\n- **Equipamentos:** Rádio sintonizado na frequência prioritária. Câmera Térmica operante."
      },
      {
        "title": "Comunicação Tática (Qru Visual)",
        "content": "Você é os \"olhos de Deus\". Sua comunicação deve pintar um quadro claro para quem está no chão.\n\n[WARNING]\n**ERRADO:** \"Acho que ele virou ali na rua da loja rosa...\"\n**CERTO:** \"QTH: Vinewood Blvd. Direção NORTE. Veículo preto em alta velocidade.\""
      },
      {
        "title": "Gerenciamento de Combustível",
        "content": "A regra de ouro: Aeronave sem combustível vira um tijolo de 2 toneladas.\n\n- **50% de Tanque:** Reporte obrigatório no rádio (\"Águia com 50% de autonomia\").\n- **25% de Tanque (BIN-GO):** Abortar missão imediatamente. Retorno à base.\n- **Pane Seca:** Queda por falta de combustível resulta em **Expulsão Imediata**."
      }
    ]
  }'::jsonb,
  NOW()
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- 2. SWAT (Special Weapons and Tactics)
INSERT INTO public.app_settings (key, value, updated_at)
VALUES (
  'manual_swat',
  '{
    "title": "TÁTICAS ESPECIAIS",
    "subtitle": "SPECIAL WEAPONS AND TACTICS",
    "modules": [
      {
        "title": "Doutrina de Entrada (CQB)",
        "content": "A velocidade é importante, mas a segurança é vital. No ambiente confinado (Close Quarters Battle), cada ângulo é uma ameaça.\n\n- **Fatiamento de Canto:** Nunca exponha o corpo inteiro. Use a técnica de \"olho e cano\".\n- **Comunicação Silenciosa:** Sinais de mão são preferenciais em aproximação furtiva."
      },
      {
        "title": "Regras de Engajamento",
        "content": "A SWAT é chamada quando a diplomacia falha. O uso de força letal é autorizado para neutralizar ameaças iminentes à vida.\n\n[WARNING]\n**Reféns no Local:** Prioridade ZERO é a vida do refém. Disparos só com visual limpo e confirmação de alvo."
      },
      {
        "title": "Equipamento Letal e Não-Letal",
        "content": "O operador deve saber alternar entre ferramentas de acordo com a escalada de força.\n\n[INFO]\n- **Taser:** Para suspeitos armados com facas ou desobedientes, mas fora de cobertura.\n- **Fuzil de Assalto:** Para combates de média distância e penetração de blindagem."
      },
      {
        "title": "Gerenciamento de Crise",
        "content": "Nem toda situação exige invasão. O perímetro deve ser mantido rigorosamente até a ordem de comando.\n\n- **Perímetro Interno:** Apenas operadores SWAT.\n- **Perímetro Externo:** Patrulha convencional (manter civis afastados)."
      }
    ]
  }'::jsonb,
  NOW()
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- 3. GTM (Grupo Tático de Motociclistas)
INSERT INTO public.app_settings (key, value, updated_at)
VALUES (
  'manual_gtm',
  '{
    "title": "PATRULHAMENTO TÁTICO",
    "subtitle": "GRUPO TÁTICO DE MOTOCICLISTAS",
    "modules": [
      {
        "title": "Doutrina de Pilotagem",
        "content": "A moto é uma extensão do seu corpo. Pilotagem agressiva quando necessário, defensiva sempre.\n\n- **Vias Expressas:** Mantenha-se no corredor, mas atento a mudanças bruscas de faixa.\n- **Abordagem:** Nunca pare a moto na frente do veículo suspeito. Pare na lateral traseira (ponto cego)."
      },
      {
        "title": "Escolta e Batedor",
        "content": "A principal função do GTM além da caça é a escolta de cargas valiosas ou VIPs.\n\n[INFO]\n- **Ponta de Lança:** A moto que vai à frente, bloqueando cruzamentos.\n- **Fecha-Cerra:** A moto que vai atrás, impedindo ultrapassagens perigosas."
      },
      {
        "title": "Táticas de Perseguição",
        "content": "Onde o carro não passa, a moto passa. Use isso a seu favor.\n\n[WARNING]\n**Risco de Queda:** Em alta velocidade, qualquer colisão é fatal. Não tente dar \"totó\" (PIT) de moto. Sua função é marcar o visual e informar o QTH."
      }
    ]
  }'::jsonb,
  NOW()
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- 4. SPEED (Interceptação Veicular)
INSERT INTO public.app_settings (key, value, updated_at)
VALUES (
  'manual_speed',
  '{
    "title": "INTERCEPTAÇÃO VEICULAR",
    "subtitle": "DIVISÃO DE ALTA VELOCIDADE",
    "modules": [
      {
        "title": "Direção Ofensiva",
        "content": "A SPEED existe para parar o que ninguém mais alcança. Veículos de alta performance exigem reflexos de piloto de corrida.\n\n- **Traçado:** Use o traçado de corrida (fora-dentro-fora) para manter velocidade nas curvas.\n- **Vácuo:** Use o vácuo do suspeito para ganhar aceleração extra antes da manobra."
      },
      {
        "title": "Manobra PIT (Precision Immobilization Technique)",
        "content": "O toque cirúrgico para desestabilizar o veículo alvo.\n\n[WARNING]\n**Velocidade Máxima:** Não aplicar PIT acima de 150km/h (Risco excessivo).\n**Local:** Jamais aplicar em pontes, viadutos ou áreas com pedestres.\n\n- **Execução:** Toque o para-choque dianteiro na lateral traseira do alvo e gire o volante suavemente."
      },
      {
        "title": "Bloqueios e Cerco",
        "content": "Se não puder alcançar, cerque.\n\n[INFO]\n- **Spike Strips (Tapetes de Pregos):** Comunicação antecipada é crucial para não furar pneus de viaturas aliadas.\n- **Box (Caixote):** Encurralar o suspeito com 3 ou 4 viaturas simultaneamente."
      }
    ]
  }'::jsonb,
  NOW()
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();


-- 5. UPDATE ALL COURSE URLs
UPDATE public.courses SET pdf_url = '/manual/gra' WHERE nome ILIKE '%GRA%';
UPDATE public.courses SET pdf_url = '/manual/swat' WHERE nome ILIKE '%SWAT%';
UPDATE public.courses SET pdf_url = '/manual/gtm' WHERE nome ILIKE '%GTM%' OR nome ILIKE '%Motos%';
UPDATE public.courses SET pdf_url = '/manual/speed' WHERE nome ILIKE '%SPEED%' OR nome ILIKE '%Interceptação%';

-- Verify updates
SELECT id, nome, pdf_url FROM public.courses WHERE tipo = 'guarnicao';
