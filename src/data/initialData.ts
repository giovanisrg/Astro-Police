export interface Curso {
    id: string;
    nome: string;
    progressao: string;
    descricao: string;
    modulos: string[];
    cargaHoraria: string;
    pdf: string;
    nivel?: string;
    minLevel: number; // Nível mínimo para se matricular neste curso
    guarnicao?: 'GRA' | 'SWAT' | 'GTM' | 'SPEED'; // Guarnição do curso (se aplicável)
}

// Banner da Landing Page
export interface BannerData {
    status: 'aberto' | 'fechado';
    titulo: string;
    subtitulo: string;
    linkDiscord?: string;
    gifUrl?: string; // URL do GIF/imagem de fundo
}

// Informações de Recrutamento (Página de Inscrições)
export interface InfoRecrutamento {
    descricao: string; // Nova descrição
    local: string;
    hora: string;
    fotoMasculino: string; // URL da foto do fardamento masculino
    fotoFeminino: string; // URL da foto do fardamento feminino
    requisitos: string[]; // Lista de requisitos (ex: Idade, ficha limpa)
}

// Material de Estudo (Página de Inscrições)
export interface MaterialEstudo {
    id: string;
    titulo: string;
    descricao: string;
    pdf: string;
    ordem: number; // Para permitir reordenação
}


export const INITIAL_CURSOS_OBRIGATORIOS: Curso[] = [
    {
        id: "cbf",
        nome: "Curso Básico de Formação (CBF)",
        progressao: "Recruta → Soldado",
        descricao: "Formar o Recruta com as competências fundamentais para o exercício da função de Soldado.",
        modulos: ["Código de Conduta", "Rádio e Comunicação", "Abordagem Padrão", "Uso Progressivo da Força"],
        cargaHoraria: "100h",
        pdf: "/pdfs/cbf.pdf",
        minLevel: 0 // Todos veem
    },
    {
        id: "cape",
        nome: "Curso de Aperfeiçoamento (CAPE)",
        progressao: "Soldado → Sargento",
        descricao: "Aperfeiçoar o Soldado para funções de maior complexidade e atuação em equipe.",
        modulos: ["Patrulhamento", "Procedimentos Operacionais", "Atuação em Equipe"],
        cargaHoraria: "100h",
        pdf: "/pdfs/cape.pdf",
        minLevel: 1 // Apenas Soldado+
    },
    {
        id: "lideranca",
        nome: "Curso de Liderança",
        progressao: "Sargento → Subtenente",
        descricao: "Capacitar o Sargento para o exercício da liderança de equipes operacionais.",
        modulos: ["Comando de Equipe", "Relatórios", "Ética e Hierarquia"],
        cargaHoraria: "100h",
        pdf: "/pdfs/lideranca.pdf",
        minLevel: 2 // Apenas Sargento+
    },
    {
        id: "oficial",
        nome: "Curso de Oficial",
        progressao: "Subtenente → Capitão",
        descricao: "Preparar o Subtenente para o ingresso no oficialato com liderança estratégica.",
        modulos: ["Liderança Estratégica", "Planejamento de Operações", "Tomada de Decisão"],
        cargaHoraria: "130h",
        pdf: "/pdfs/oficial.pdf",
        minLevel: 3 // Apenas Subtenente+
    },
    {
        id: "alto_comando",
        nome: "Curso de Alto Comando",
        progressao: "Capitão → Major",
        descricao: "Habilitar o Capitão para funções de gestão institucional e operações de grande escala.",
        modulos: ["Gestão Institucional", "Disciplina e Corregedoria", "Operações de Grande Escala"],
        cargaHoraria: "140h",
        pdf: "/pdfs/alto_comando.pdf",
        minLevel: 4 // Apenas Capitão+
    }
];

export const INITIAL_CURSOS_GUARNICAO: Curso[] = [
    {
        id: "gra",
        nome: "Curso de Operações Aéreas – GRA",
        progressao: "Soldado • Boa Conduta",
        descricao: "Disciplina extrema, sangue frio, comunicação perfeita.",
        modulos: [
            "Doutrina aérea policial",
            "Comunicação ar-solo",
            "Segurança em voo",
            "Apoio aéreo em perseguição",
            "Resgate aéreo",
            "Procedimentos de emergência"
        ],
        cargaHoraria: "Especialização",
        pdf: "/manual/gra",
        nivel: "Entrada",
        minLevel: 1, // Soldado+ pode ver especialização
        guarnicao: "GRA" // Curso da guarnição GRA
    },
    {
        id: "swat",
        nome: "Curso de Ações Táticas e CQB – SWAT",
        progressao: "Soldado • Histórico Exemplar",
        descricao: "Elite de combate, tomada de decisão sob pressão.",
        modulos: [
            "CQB (combate em ambiente fechado)",
            "Invasão tática",
            "Progressão em equipe",
            "Gerenciamento de crise",
            "Uso letal da força",
            "Treino de reação sob estresse"
        ],
        cargaHoraria: "Especialização",
        pdf: "/pdfs/swat.pdf",
        nivel: "Entrada",
        minLevel: 1,
        guarnicao: "SWAT" // Curso da guarnição SWAT
    },
    {
        id: "gtm",
        nome: "Curso de Patrulhamento Tático em Motocicletas – GTM",
        progressao: "Soldado • Pilotagem",
        descricao: "Agilidade, leitura de trânsito, disciplina urbana.",
        modulos: [
            "Pilotagem defensiva e ofensiva",
            "Patrulhamento urbano",
            "Acompanhamento rápido",
            "Controle de vias",
            "Comunicação em deslocamento"
        ],
        cargaHoraria: "Especialização",
        pdf: "/pdfs/gtm.pdf",
        nivel: "Entrada",
        minLevel: 1,
        guarnicao: "GTM" // Curso da guarnição GTM
    },
    {
        id: "speed",
        nome: "Curso de Interceptação Veicular – SPEED",
        progressao: "Soldado • Direção",
        descricao: "Precisão, paciência, controle de perseguição.",
        modulos: [
            "Direção ofensiva e defensiva",
            "PIT maneuver",
            "Coordenação em perseguição",
            "Cerco e bloqueio",
            "Decisão de abortar perseguição"
        ],
        cargaHoraria: "Especialização",
        pdf: "/pdfs/speed.pdf",
        nivel: "Entrada",
        minLevel: 1,
        guarnicao: "SPEED" // Curso da guarnição SPEED
    }
];


// Dados Iniciais: Banner da Landing Page
export const INITIAL_BANNER_DATA: BannerData = {
    status: 'aberto',
    titulo: 'INSCRIÇÕES ABERTAS',
    subtitulo: 'Venha fazer parte da elite da Astro Police. Sua jornada começa aqui.',
    linkDiscord: 'https://discord.gg/seu-servidor',
    gifUrl: '/img/banner_terrestre.png'
};

// Dados Iniciais: Informações de Recrutamento
export const INITIAL_INFO_RECRUTAMENTO: InfoRecrutamento = {
    descricao: 'Detalhes sobre o recrutamento presencial',
    local: 'Departamento de Polícia de AstroRP (DP Central)',
    hora: 'Todos os dias às 19:00',
    fotoMasculino: 'https://placehold.co/300x400/1a1a1a/00d9ff?text=Farda+Masc',
    fotoFeminino: 'https://placehold.co/300x400/1a1a1a/ff00d9?text=Farda+Fem',
    requisitos: [
        'Ter mais de 18 anos',
        'Não possuir antecedentes criminais',
        'Possuir carteira de motorista válida',
        'Comprometimento com a hierarquia e disciplina'
    ]
};

// Dados Iniciais: Materiais de Estudo
export const INITIAL_MATERIAIS_ESTUDO: MaterialEstudo[] = [
    {
        id: 'manual-recruta',
        titulo: 'Manual do Recruta v2.0',
        descricao: 'Leitura obrigatória para o exame de admissão.',
        pdf: '/pdfs/manual-recruta.pdf',
        ordem: 1
    },
    {
        id: 'codigo-penal',
        titulo: 'Código Penal de AstroRP',
        descricao: 'Guia de leis e infrações da cidade.',
        pdf: '/pdfs/codigo-penal.pdf',
        ordem: 2
    }
];

// Dados Iniciais: Instrutores (Página de Instrutores)

