-- Force Insert/Upsert of Initial Courses
-- Run this in the Supabase SQL Editor to populate the table

INSERT INTO public.courses (id, nome, descricao, modulos, carga_horaria, pdf_url, min_level, progressao, tipo, guarnicao_tag)
VALUES
-- Obrigatórios
('cbf', 'Curso Básico de Formação (CBF)', 'Formar o Recruta com as competências fundamentais para o exercício da função de Soldado.', ARRAY['Código de Conduta', 'Rádio e Comunicação', 'Abordagem Padrão', 'Uso Progressivo da Força'], '100h', '/pdfs/cbf.pdf', 0, 'Recruta → Soldado', 'obrigatorio', NULL),
('cape', 'Curso de Aperfeiçoamento (CAPE)', 'Aperfeiçoar o Soldado para funções de maior complexidade e atuação em equipe.', ARRAY['Patrulhamento', 'Procedimentos Operacionais', 'Atuação em Equipe'], '100h', '/pdfs/cape.pdf', 1, 'Soldado → Sargento', 'obrigatorio', NULL),
('lideranca', 'Curso de Liderança', 'Capacitar o Sargento para o exercício da liderança de equipes operacionais.', ARRAY['Comando de Equipe', 'Relatórios', 'Ética e Hierarquia'], '100h', '/pdfs/lideranca.pdf', 2, 'Sargento → Subtenente', 'obrigatorio', NULL),
('oficial', 'Curso de Oficial', 'Preparar o Subtenente para o ingresso no oficialato com liderança estratégica.', ARRAY['Liderança Estratégica', 'Planejamento de Operações', 'Tomada de Decisão'], '130h', '/pdfs/oficial.pdf', 3, 'Subtenente → Capitão', 'obrigatorio', NULL),
('alto_comando', 'Curso de Alto Comando', 'Habilitar o Capitão para funções de gestão institucional e operações de grande escala.', ARRAY['Gestão Institucional', 'Disciplina e Corregedoria', 'Operações de Grande Escala'], '140h', '/pdfs/alto_comando.pdf', 4, 'Capitão → Major', 'obrigatorio', NULL),

-- Guarnições
('gra', 'Curso de Operações Aéreas – GRA', 'Disciplina extrema, sangue frio, comunicação perfeita.', ARRAY['Doutrina aérea policial', 'Comunicação ar-solo', 'Segurança em voo', 'Apoio aéreo em perseguição', 'Resgate aéreo', 'Procedimentos de emergência'], 'Especialização', '/pdfs/gra.pdf', 1, 'Soldado • Boa Conduta', 'guarnicao', 'GRA'),
('swat', 'Curso de Ações Táticas e CQB – SWAT', 'Elite de combate, tomada de decisão sob pressão.', ARRAY['CQB (combate em ambiente fechado)', 'Invasão tática', 'Progressão em equipe', 'Gerenciamento de crise', 'Uso letal da força', 'Treino de reação sob estresse'], 'Especialização', '/pdfs/swat.pdf', 1, 'Soldado • Histórico Exemplar', 'guarnicao', 'SWAT'),
('gtm', 'Curso de Patrulhamento Tático em Motocicletas – GTM', 'Agilidade, leitura de trânsito, disciplina urbana.', ARRAY['Pilotagem defensiva e ofensiva', 'Patrulhamento urbano', 'Acompanhamento rápido', 'Controle de vias', 'Comunicação em deslocamento'], 'Especialização', '/pdfs/gtm.pdf', 1, 'Soldado • Pilotagem', 'guarnicao', 'GTM'),
('speed', 'Curso de Interceptação Veicular – SPEED', 'Precisão, paciência, controle de perseguição.', ARRAY['Direção ofensiva e defensiva', 'PIT maneuver', 'Coordenação em perseguição', 'Cerco e bloqueio', 'Decisão de abortar perseguição'], 'Especialização', '/pdfs/speed.pdf', 1, 'Soldado • Direção', 'guarnicao', 'SPEED')

ON CONFLICT (id) DO UPDATE SET
    nome = EXCLUDED.nome,
    descricao = EXCLUDED.descricao,
    modulos = EXCLUDED.modulos,
    carga_horaria = EXCLUDED.carga_horaria,
    pdf_url = EXCLUDED.pdf_url,
    min_level = EXCLUDED.min_level,
    progressao = EXCLUDED.progressao,
    tipo = EXCLUDED.tipo,
    guarnicao_tag = EXCLUDED.guarnicao_tag;
