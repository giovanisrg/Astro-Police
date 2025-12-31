// ==================================================================================
// ARQUIVO DE CONFIGURAÇÃO DE CARGOS E PERMISSÕES
// ==================================================================================
// Este arquivo controla quem pode ver o que no site, baseado nos cargos do Discord.
//
// COMO EDITAR:
// 1. Encontre a seção desejada (Patentes, Guarnições ou Instrutores).
// 2. Substitua o valor do "id" pelo ID numérico do cargo no seu Discord.
//    Exemplo: Troque "ID_DO_CARGO_RECRUTA" por "123456789012345678".
// ==================================================================================

export const ROLE_CONFIG = {

    // --------------------------------------------------------------------------------
    // 0. SERVIDOR DISCORD ALVO
    // --------------------------------------------------------------------------------
    // Coloque aqui o ID do seu Servidor (Guild ID) onde os cargos serão verificados.
    DISCORD_SERVER_ID: "ID_DO_SEU_SERVIDOR_DISCORD",

    // --------------------------------------------------------------------------------
    // 0.1 CARGO DE ACESSO (Obrigatório para visualizar cursos)
    // --------------------------------------------------------------------------------
    // O usuário deve ter este cargo (ex: "Cidadão" ou "Verificado") para ver qualquer curso.
    ACCESS_ROLE_ID: "ID_DO_CARGO_VERIFICADO_OU_CIDADAO",

    // --------------------------------------------------------------------------------
    // 1. PATENTES (Define o Nível de Acesso aos Cursos Obrigatórios)
    // --------------------------------------------------------------------------------
    // O 'level' define a hierarquia. Quem tem level 2 vê cursos de level 0, 1 e 2.
    PATENTES: [
        {
            id: "ID_DO_CARGO_RECRUTA", // <--- Coloque o ID do cargo Recruta aqui
            nome: "Recruta",
            level: 0 // Acesso básico (Apenas CBF)
        },
        {
            id: "ID_DO_CARGO_SOLDADO", // <--- Coloque o ID do cargo Soldado aqui
            nome: "Soldado",
            level: 1 // Vê cursos de Soldado + Recruta
        },
        {
            id: "ID_DO_CARGO_SARGENTO",
            nome: "Sargento",
            level: 2
        },
        {
            id: "ID_DO_CARGO_SUBTENENTE",
            nome: "Subtenente",
            level: 3
        },
        {
            id: "ID_DO_CARGO_CAPITAO",
            nome: "Capitão",
            level: 4 // Vê tudo
        }
    ],

    // --------------------------------------------------------------------------------
    // 2. GUARNIÇÕES (Libera abas e cursos específicos de guarnição)
    // --------------------------------------------------------------------------------
    // Se o usuário tiver este cargo, ele verá a aba da guarnição correspondente.
    GUARNICOES: {
        GRA: {
            id: "ID_DO_CARGO_GRA", // <--- ID do cargo GRA no Discord
            nome: "GRA - Grupo de Resgate Aéreo"
        },
        SWAT: {
            id: "ID_DO_CARGO_SWAT",
            nome: "SWAT - Táticas Especiais"
        },
        GTM: {
            id: "ID_DO_CARGO_GTM",
            nome: "GTM - Grupo Tático de Motos"
        },
        SPEED: {
            id: "ID_DO_CARGO_SPEED",
            nome: "SPEED - Interceptação Rápida"
        }
    },

    // --------------------------------------------------------------------------------
    // 3. INSTRUTORES (Libera botões de edição de conteúdo)
    // --------------------------------------------------------------------------------
    INSTRUTORES: {
        GERAL: {
            // Lista de IDs dos cargos que podem CRIAR, EDITAR e EXCLUIR cursos (Admin)
            ids: [
                "ID_DO_CARGO_INSTRUTOR_GERAL",
                "ID_DO_CARGO_DIRETOR",
                "OUTRO_ID_AQUI"
            ],
            nome: "Instrutor Chefe / Admin"
        },
        // Instrutores de guarnição (podem baixar PDFs da sua área)
        GRA: "ID_INSTRUTOR_GRA",
        SWAT: "ID_INSTRUTOR_SWAT",
        GTM: "ID_INSTRUTOR_GTM",
        SPEED: "ID_INSTRUTOR_SPEED"
    },

    // --------------------------------------------------------------------------------
    // 4. LISTA DE MEMBROS DA PÁGINA "INSTRUTORES"
    // --------------------------------------------------------------------------------
    // Configure aqui os cargos que aparecerão na página de Equipe.
    LISTA_INSTRUTORES: {
        ADMIN: {
            titulo: "Coordenação Geral",
            roles: [
                { id: "ID_CARGO_DIRETOR", nome: "Diretor" },
                { id: "ID_CARGO_VICE_DIRETOR", nome: "Vice-Diretor" }
            ]
        },
        GRA: {
            titulo: "Instrutores GRA",
            roles: [
                { id: "ID_CARGO_INSTRUTOR_GRA", nome: "Instrutor GRA" }
            ]
        },
        SWAT: {
            titulo: "Instrutores SWAT",
            roles: [
                { id: "ID_CARGO_INSTRUTOR_SWAT", nome: "Instrutor SWAT" }
            ]
        },
        GTM: {
            titulo: "Instrutores GTM",
            roles: [
                { id: "ID_CARGO_INSTRUTOR_GTM", nome: "Instrutor GTM" }
            ]
        },
        SPEED: {
            titulo: "Instrutores SPEED",
            roles: [
                { id: "ID_CARGO_INSTRUTOR_SPEED", nome: "Instrutor SPEED" }
            ]
        }
    }
};

// ==================================================================================
// FIM DA CONFIGURAÇÃO - Não precisa mexer abaixo desta linha
// ==================================================================================

// Helper types para uso no código
export type RoleConfigType = typeof ROLE_CONFIG;
