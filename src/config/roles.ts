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
    DISCORD_SERVER_ID: "1079947072071016558",

    // --------------------------------------------------------------------------------
    // 0.1 CARGO DE ACESSO (Obrigatório para visualizar cursos)
    // --------------------------------------------------------------------------------
    // O usuário deve ter este cargo (ex: "Cidadão" ou "Verificado") para ver qualquer curso.
    ACCESS_ROLE_ID: "1455328452331835657",

    // --------------------------------------------------------------------------------
    // 1. PATENTES (Define o Nível de Acesso aos Cursos Obrigatórios)
    // --------------------------------------------------------------------------------
    // O 'level' define a hierarquia. Quem tem level 2 vê cursos de level 0, 1 e 2.
    PATENTES: [
        {
            id: "1455328452331835657", // <--- Coloque o ID do cargo Recruta aqui
            nome: "Recruta",
            level: 0 // Acesso básico (Apenas CBF)
        },
        {
            id: "1455328451421798662", // <--- Coloque o ID do cargo Soldado aqui
            nome: "Soldado",
            level: 1 // Vê cursos de Soldado + Recruta
        },
        {
            id: "1455328449844482155",
            nome: "cabo",
            level: 1
        },
        {
            id: "1455328448217350225",
            nome: "Sargento",
            level: 2
        },
        {
            id: "1455328446245769248",
            nome: "Sargento 2",
            level: 2
        },
        {
            id: "1455328444941598800",
            nome: "Sargento 3",
            level: 2
        },
        {
            id: "1455328443720794203",
            nome: "Subtenente",
            level: 3
        },
        {
            id: "1455328442034815040",
            nome: "Tenente 1",
            level: 3
        },
        {
            id: "1455328440793170166",
            nome: "Tenente 2",
            level: 3
        },
        {
            id: "1455328438901801168",
            nome: "Capitão",
            level: 4 // Vê tudo
        },
        {
            id: "1455328437446377482",
            nome: "Major",
            level: 4 // Vê tudo
        },
        {
            id: "1455328435965792519",
            nome: "Sub-Comando",
            level: 4 // Vê tudo
        }
    ],


    // --------------------------------------------------------------------------------
    // 3. INSTRUTORES (Libera botões de edição de conteúdo)
    // --------------------------------------------------------------------------------
    INSTRUTORES: {
        GERAL: {
            // Lista de IDs dos cargos que podem CRIAR, EDITAR e EXCLUIR cursos (Admin)
            ids: [
                "1455328454676316200",
                "ID_DO_CARGO_DIRETOR",
                "OUTRO_ID_AQUI"
            ],
            nome: "Instrutor Chefe / Admin"
        },
        // Instrutores de guarnição (podem baixar PDFs da sua área)
        GRA: "1455328464470147132",
        SWAT: "1455328460036898888", // Usando o mesmo ID da SWAT
        GTM: "1455328472107978855",
        SPEED: "1455328468429705407",

        // Instrutor de Formação (pode baixar QUALQUER PDF da aba "Cursos Obrigatórios")
        FORMACAO: "1455328457213874331",
        RECRUTADOR: "1455328457213874331" // Cargo X para acessar sistema de recrutamento
    },


};

// ==================================================================================
// FIM DA CONFIGURAÇÃO - Não precisa mexer abaixo desta linha
// ==================================================================================

// Helper types para uso no código
export type RoleConfigType = typeof ROLE_CONFIG;
