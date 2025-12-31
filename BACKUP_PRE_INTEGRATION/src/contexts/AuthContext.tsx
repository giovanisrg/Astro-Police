import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos de Patente/Cargo
export type Rank = 'Civil' | 'Recruta' | 'Soldado' | 'Sargento' | 'Subtenente' | 'Capitão' | 'Major';

// Tipos de Instrutor
export type InstructorType = 'none' | 'geral' | 'GRA' | 'SWAT' | 'GTM' | 'SPEED';

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
    guarnicoes: string[]; // Guarnições que o usuário possui (GRA, SWAT, GTM, SPEED)
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
    hasGuarnicao: (guarnicao: string) => boolean; // Verifica se tem guarnição
    simulateCompleteCourse: (courseId: string) => void; // Simular conclusão de curso
    simulateAddGuarnicao: (guarnicao: string) => void; // Simular adicionar guarnição
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
    const [isLoading, setIsLoading] = useState(false);

    // Simulação de Login com Discord
    const login = () => {
        setIsLoading(true);
        // Simulando delay de API
        setTimeout(() => {
            setUser({
                id: '123456789',
                username: 'Oficial.Astronauta',
                discriminator: '0001',
                avatar: 'https://github.com/shadcn.png', // Placeholder
                rank: 'Soldado', // Cargo inicial padrão na simulação
                level: RANK_LEVELS['Soldado'],
                instructorType: 'none', // Por padrão, usuário é Aluno
                completedCourses: [], // Nenhum curso concluído inicialmente
                guarnicoes: [], // Nenhuma guarnição inicialmente
                memberOfDiscord: false, // Começa FORA do Discord para teste
                discordRoles: [] // Sem cargos
            });
            setIsLoading(false);
        }, 1000);
    };

    const logout = () => {
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

        // Regra 2: Tem que ter o cargo de acesso
        if (!user.discordRoles.includes(ROLE_CONFIG.ACCESS_ROLE_ID)) return false;

        return user.level >= minLevel;
    };

    const canDownloadPDF = (guarnicao?: string) => {
        if (!user || user.instructorType === 'none') return false;
        if (user.instructorType === 'geral') return true;

        // Instrutor específico só pode baixar PDF de sua guarnição
        return guarnicao === user.instructorType;
    };

    const canEnroll = (minLevel: number) => {
        // Instrutores não se matriculam
        if (user?.instructorType !== 'none') return false;

        // Regra 1: Tem que estar no Discord
        if (!user?.memberOfDiscord) return false;

        // Regra 2: Tem que ter o cargo de acesso
        if (!user?.discordRoles.includes(ROLE_CONFIG.ACCESS_ROLE_ID)) return false;

        // Alunos só podem se matricular se atenderem o minLevel
        return user ? user.level >= minLevel : false;
    };

    const hasCourse = (courseId: string) => {
        return user?.completedCourses.includes(courseId) ?? false;
    };

    const hasGuarnicao = (guarnicao: string) => {
        return user?.guarnicoes.includes(guarnicao) ?? false;
    };

    const simulateCompleteCourse = (courseId: string) => {
        if (user && !user.completedCourses.includes(courseId)) {
            setUser({
                ...user,
                completedCourses: [...user.completedCourses, courseId]
            });
        }
    };

    const simulateAddGuarnicao = (guarnicao: string) => {
        if (user) {
            // Toggle: se já tem, remove; se não tem, adiciona
            const hasIt = user.guarnicoes.includes(guarnicao);
            setUser({
                ...user,
                guarnicoes: hasIt
                    ? user.guarnicoes.filter(g => g !== guarnicao)
                    : [...user.guarnicoes, guarnicao]
            });
        }
    };

    const simulateJoinDiscord = () => {
        if (user) {
            setUser({ ...user, memberOfDiscord: true });
        }
    }

    const simulateAddRole = (roleId: string) => {
        if (user) {
            // Toggle role
            const hasRole = user.discordRoles.includes(roleId);
            setUser({
                ...user,
                discordRoles: hasRole
                    ? user.discordRoles.filter(r => r !== roleId)
                    : [...user.discordRoles, roleId]
            });
        }
    }

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
            hasGuarnicao,
            simulateCompleteCourse,
            simulateAddGuarnicao,
            simulateJoinDiscord,
            simulateAddRole
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
