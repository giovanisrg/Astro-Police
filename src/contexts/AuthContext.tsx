import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

// Tipos de Patente/Cargo
export type Rank = 'Civil' | 'Recruta' | 'Soldado' | 'cabo' | '1° Sargento' | '2° Sargento' | '3° Sargento' | 'Subtenente' | '1° Tenente' | '2° Tenente' | 'Superintendente' | 'Capitão' | 'Major' | 'Tenente Coronel' | 'Coronel' | 'Comando';

// Tipos de Instrutor
// Tipos de Instrutor
export type InstructorType = 'none' | 'geral' | 'formacao' | 'GRA' | 'SWAT' | 'GTM' | 'SPEED';


// Interface do Usuário
export interface User {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    rank: Rank;
    level: number; // Nível numérico para facilitar comparação (0, 1, 2...)
    instructorType: InstructorType; // Tipo de Instrutor (none, geral, GRA, SWAT, GTM, SPEED)
    completedCourses: string[]; // IDs dos cursos concluídos

    memberOfDiscord: boolean; // Se está no servidor do Discord
    discordRoles: string[]; // IDs dos cargos do Discord
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
    simulateRankChange: (rank: Rank) => void;
    simulateInstructorChange: (type: InstructorType) => void; // Mudar tipo de Instrutor
    canViewCourse: (minLevel: number) => boolean;
    canDownloadPDF: (guarnicao?: string) => boolean; // Verifica se pode baixar PDF baseado na guarnição
    canEnroll: (minLevel: number) => boolean; // Verifica se Aluno pode se matricular
    hasCourse: (courseId: string) => boolean; // Verifica se completou curso

    simulateCompleteCourse: (courseId: string) => void; // Simular conclusão de curso

    simulateJoinDiscord: () => void; // Simular entrar no Discord
    simulateAddRole: (roleId: string) => void; // Simular ganhar cargo
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { ROLE_CONFIG } from '../config/roles';

// ... imports existentes ...

// Mapeamento de Patente para Nível de Acesso (Gerado dinamicamente via Config)
const RANK_LEVELS: Record<string, number> = {
    'Civil': 0 // Default
};

// Carregar níveis do arquivo de configuração
ROLE_CONFIG.PATENTES.forEach(p => {
    RANK_LEVELS[p.nome] = p.level;
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start loading true to check session

    // Static control to prevent multiple fetches in short time (React Strict Mode double mount protection)
    const lastFetchRef = React.useRef<number>(0);
    const isFetchingRef = React.useRef<boolean>(false);

    useEffect(() => {
        let mounted = true;

        const initSession = async () => {
            // 1. Get current session
            const { data: { session } } = await supabase.auth.getSession();

            if (mounted) {
                if (session) {
                    await handleUserSession(session);
                } else {
                    setIsLoading(false);
                }
            }
        };

        initSession();

        // 2. Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth Event:", event);
            if (session) {
                // Avoid re-fetching if we just fetched (except for SIGNED_IN which is explicit)
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                    await handleUserSession(session);
                } else if (event === 'INITIAL_SESSION') {
                    // Initial session is usually handled by getSession() above, so we might skip or check if loaded
                    // But to be safe, we can run it if isLoading is still true
                    if (isLoading) await handleUserSession(session);
                }
            } else {
                setUser(null);
                setIsLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const handleUserSession = async (session: any) => {
        let { user: sbUser, provider_token } = session;

        if (provider_token) {
            localStorage.setItem('discord_token', provider_token);
        } else {
            provider_token = localStorage.getItem('discord_token');
        }

        let discordData = {
            memberOfDiscord: false,
            discordRoles: [] as string[]
        };

        if (provider_token) {
            try {
                // --- OPTIMIZATION & DEBOUNCE ---
                const now = Date.now();
                // Cache reduced to 2 minutes for faster response but safety against spam
                const CACHE_DURATION = 2 * 60 * 1000;
                // Debounce: Don't fetch if we fetched in the last 2 seconds (prevents Strict Mode double-invoke)
                const DEBOUNCE_TIME = 2000;

                const cachedData = localStorage.getItem('discord_member_data');
                const cachedTime = localStorage.getItem('discord_member_cache_time');

                let validCache = false;
                if (cachedData && cachedTime) {
                    const age = now - parseInt(cachedTime);
                    if (age < CACHE_DURATION) validCache = true;
                }

                // If currently fetching, or fetched extremely recently (debounce), return early or use cache
                if (isFetchingRef.current || (now - lastFetchRef.current < DEBOUNCE_TIME)) {
                    console.log("⏳ Skipping duplicate/debounced Discord fetch.");
                    if (cachedData) {
                        const memberData = JSON.parse(cachedData);
                        discordData = { memberOfDiscord: true, discordRoles: memberData.roles || [] };
                    }
                }
                else if (validCache) {
                    const memberData = JSON.parse(cachedData!);
                    console.log("📦 Using Discord Cache (Active):", memberData);
                    discordData = {
                        memberOfDiscord: true,
                        discordRoles: memberData.roles || []
                    };
                } else {
                    // --- FETCH NEW DATA ---
                    isFetchingRef.current = true;
                    lastFetchRef.current = now;

                    const response = await fetch(`https://discord.com/api/users/@me/guilds/${ROLE_CONFIG.DISCORD_SERVER_ID}/member`, {
                        headers: { Authorization: `Bearer ${provider_token}` }
                    });

                    isFetchingRef.current = false;

                    if (response.ok) {
                        const memberData = await response.json();
                        console.log("✅ Discord API Live Fetch:", memberData);

                        localStorage.setItem('discord_member_data', JSON.stringify(memberData));
                        localStorage.setItem('discord_member_cache_time', now.toString());

                        discordData = {
                            memberOfDiscord: true,
                            discordRoles: memberData.roles || []
                        };
                    } else if (response.status === 429) {
                        console.warn("⚠️ Rate Limit 429 Hit. Using fallback cache.");
                        if (cachedData) {
                            const memberData = JSON.parse(cachedData);
                            discordData = { memberOfDiscord: true, discordRoles: memberData.roles || [] };
                            toast.warning("Verificação lenta. Usando dados salvos.");
                        } else {
                            toast.error("Discord ocupado. Tente novamente em instantes.");
                        }
                    } else {
                        console.warn("Discord API Error:", response.status);
                    }
                }

            } catch (error) {
                console.error("Error in Discord logic:", error);
                isFetchingRef.current = false;
            }
        }

        // Calcular Patente Real baseada nos cargos
        let currentRank: Rank = 'Civil';
        let currentLevel = RANK_LEVELS['Civil'];

        // Ordenar patentes por nível (do maior para o menor) para pegar a mais alta
        const sortedPatentes = [...ROLE_CONFIG.PATENTES].sort((a, b) => b.level - a.level);

        for (const patente of sortedPatentes) {
            if (discordData.discordRoles.includes(patente.id)) {
                currentRank = patente.nome as Rank;
                currentLevel = patente.level;
                break; // Achou a mais alta, para
            }
        }

        // Calcular Instructor Type
        let instructorType: InstructorType = 'none';

        // 1. Check Admin/Geral (Prioridade Máxima)
        if (ROLE_CONFIG.INSTRUTORES.GERAL.ids.some(id => discordData.discordRoles.includes(id))) {
            instructorType = 'geral';
        }
        // 2. Check Instrutor de Formação (Pode baixar PDFs Obrigatórios)
        else if (discordData.discordRoles.includes(ROLE_CONFIG.INSTRUTORES.FORMACAO)) {
            instructorType = 'formacao';
        }
        // 3. Check Guarnições
        else if (discordData.discordRoles.includes(ROLE_CONFIG.INSTRUTORES.GRA)) instructorType = 'GRA';
        else if (discordData.discordRoles.includes(ROLE_CONFIG.INSTRUTORES.SWAT)) instructorType = 'SWAT';
        else if (discordData.discordRoles.includes(ROLE_CONFIG.INSTRUTORES.GTM)) instructorType = 'GTM';
        else if (discordData.discordRoles.includes(ROLE_CONFIG.INSTRUTORES.SPEED)) instructorType = 'SPEED';


        // DETERMINAR NOME EXIBIDO (Prioridade: Apelido no Server > Nome Global > Nome de Usuário > Metadata Supabase)
        let displayName = sbUser.user_metadata.full_name || sbUser.email?.split('@')[0] || 'User';

        // Se tivermos dados do membro do Discord (Fetched or Cached)
        // Precisamos garantir que 'discordData' ou a fonte original tenha o 'nick' ou 'user.global_name'
        // O fetch retorna o objeto membro completo. Vamos ver se salvei isso.
        // O localStorage 'discord_member_data' tem o JSON completo.

        try {
            const cachedMember = localStorage.getItem('discord_member_data');
            if (cachedMember) {
                const memberObj = JSON.parse(cachedMember);
                if (memberObj.nick) {
                    displayName = memberObj.nick; // Apelido no servidor (Prioridade 1)
                } else if (memberObj.user && memberObj.user.global_name) {
                    displayName = memberObj.user.global_name; // Nome global (Prioridade 2)
                } else if (memberObj.user && memberObj.user.username) {
                    displayName = memberObj.user.username; // Username (Prioridade 3)
                }
            }
        } catch (e) {
            console.error("Erro ao processar nome do Discord:", e);
        }

        setUser({
            id: sbUser.id,
            username: displayName, // Agora usa o nome real!
            discriminator: '0000',
            avatar: sbUser.user_metadata.avatar_url || 'https://github.com/shadcn.png',
            rank: currentRank,
            level: currentLevel,
            instructorType: instructorType,
            completedCourses: [],

            memberOfDiscord: discordData.memberOfDiscord,
            discordRoles: discordData.discordRoles
        });
        setIsLoading(false);
    };

    const login = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
                scopes: 'guilds guilds.members.read',
                // Redirect URL is handled by Supabase config, typically window.location.origin
                redirectTo: window.location.origin
            }
        });
        if (error) console.error("Login error:", error);
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const simulateRankChange = (rank: Rank) => {
        if (user) {
            setUser({
                ...user,
                rank,
                level: RANK_LEVELS[rank],
                instructorType: 'none' // Resetar instructorType ao mudar de patente
            });
        }
    };

    const simulateInstructorChange = (type: InstructorType) => {
        if (user) {
            setUser({
                ...user,
                instructorType: type
            });
        }
    };

    const canViewCourse = (minLevel: number) => {
        if (!user) return false;

        // Regra 1: Tem que estar no Discord
        if (!user.memberOfDiscord) return false;

        // Regra 2: Tem que ter o cargo de acesso OU qualquer patente válida
        // (Isso resolve o caso de alguém ser Soldado mas não ter o cargo Recruta/Acesso)
        const hasAccessRole = user.discordRoles.includes(ROLE_CONFIG.ACCESS_ROLE_ID);
        const hasAnyRank = ROLE_CONFIG.PATENTES.some(p => user.discordRoles.includes(p.id));

        if (!hasAccessRole && !hasAnyRank) return false;

        return user.level >= minLevel;
    };

    const canDownloadPDF = (guarnicao?: string) => {
        if (!user || user.instructorType === 'none') return false;

        // Admin Geral baixa tudo
        if (user.instructorType === 'geral') return true;

        // Instrutor de Formação baixa APENAS cursos obrigatórios (sem guarnição definida)
        if (user.instructorType === 'formacao') {
            return !guarnicao; // Retorna true se guarnição for undefined/null
        }

        // Instrutor específico só pode baixar PDF de sua guarnição
        return guarnicao === user.instructorType;
    };

    const canEnroll = (minLevel: number) => {
        // Agora permitimos que instrutores se matriculem em cursos que não são de sua responsabilidade
        // A checagem se ele é instrutor DAQUELE curso já acontece na UI (Home.tsx) que prioriza o botão de PDF

        // Regra 1: Tem que estar no Discord
        if (!user?.memberOfDiscord) return false;

        // Regra 2: Tem que ter o cargo de acesso OU qualquer patente válida
        const hasAccessRole = user?.discordRoles.includes(ROLE_CONFIG.ACCESS_ROLE_ID);
        const hasAnyRank = ROLE_CONFIG.PATENTES.some(p => user?.discordRoles.includes(p.id));

        if (!hasAccessRole && !hasAnyRank) return false;

        // Alunos só podem se matricular se atenderem o minLevel
        return user ? user.level >= minLevel : false;
    };

    const hasCourse = (courseId: string) => {
        return user?.completedCourses.includes(courseId) ?? false;
    };



    const simulateCompleteCourse = (courseId: string) => {
        if (user && !user.completedCourses.includes(courseId)) {
            setUser({
                ...user,
                completedCourses: [...user.completedCourses, courseId]
            });
        }
    };





    // Removed simulateJoinDiscord and simulateAddRole

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login,
            logout,
            simulateRankChange,
            simulateInstructorChange,
            canViewCourse,
            canDownloadPDF,
            canEnroll,
            hasCourse,
            simulateCompleteCourse,
            simulateJoinDiscord: () => { }, // No-op to prevent breaking changes immediately if used elsewhere, or better to remove from interface
            simulateAddRole: () => { }     // No-op
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
