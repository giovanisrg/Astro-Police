import { Button } from "@/components/ui/button";
import { useAuth, Rank, InstructorType } from "@/contexts/AuthContext";
import { Shield, LogIn, LogOut, GraduationCap, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { INITIAL_BANNER_DATA, INITIAL_INSTRUTORES } from "@/data/initialData";
import { Badge } from "@/components/ui/badge";

import { ROLE_CONFIG } from "@/config/roles";

export function Header({ enrollmentStatus = 'aberto' }: { enrollmentStatus?: 'aberto' | 'fechado' }) {
    const { user, login, logout, simulateRankChange, simulateInstructorChange, simulateJoinDiscord, simulateAddRole, isLoading } = useAuth();

    // Gerar lista de patentes dinamicamente do Config
    const ranks = ROLE_CONFIG.PATENTES.map(p => p.nome as Rank);

    const isEnrollmentLocked = enrollmentStatus === 'fechado' && user?.instructorType !== 'geral';

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-primary/20 bg-background/80 backdrop-blur-lg"
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo + Navigation */}
                <div className="flex items-center gap-6">
                    {/* Logo */}
                    <Link href="/">
                        <a className="flex items-center gap-3 cursor-pointer">
                            <div className="relative">
                                <Shield className="w-8 h-8 text-primary glow" />
                                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold tracking-wider text-foreground leading-none">
                                    ASTRO POLICE
                                </span>
                                <span className="text-[10px] text-primary tracking-[0.2em] font-medium leading-none">
                                    CURSOS
                                </span>
                            </div>
                        </a>
                    </Link>

                    {/* Navigation Buttons */}
                    <nav className="hidden md:flex items-center gap-2">
                        <Link href="/">
                            <a>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10"
                                >
                                    Início
                                </Button>
                            </a>
                        </Link>
                        {isEnrollmentLocked ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled
                                className="text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed"
                                title="Inscrições fechadas no momento"
                            >
                                Inscrições (Fechado)
                            </Button>
                        ) : (
                            <Link href="/inscricoes">
                                <a>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10"
                                    >
                                        Inscrições
                                    </Button>
                                </a>
                            </Link>
                        )}


                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10"
                                >
                                    Instrutores
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 max-h-[80vh] overflow-y-auto">

                                {['Geral', 'GRA', 'SWAT', 'GTM', 'SPEED'].map((cargo) => {
                                    const insts = INITIAL_INSTRUTORES.filter(i => i.cargo === cargo);
                                    if (insts.length === 0) return null;

                                    return (
                                        <div key={cargo} className="mb-2">
                                            <div className="bg-secondary/50 px-2 py-1 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 flex items-center justify-between">
                                                <span>{cargo === 'Geral' ? 'Instrutor Geral' : `Instrutor ${cargo}`}</span>
                                                <Badge variant="outline" className="text-[10px] h-4 px-1 border-primary/20">{insts.length}</Badge>
                                            </div>
                                            {insts.map(inst => (
                                                <div key={inst.id} className="px-3 py-1.5 text-xs hover:bg-muted/50 transition-colors flex items-center gap-2 cursor-default">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${inst.status === 'online' ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' :
                                                        inst.status === 'ocupado' ? 'bg-yellow-500' : 'bg-slate-500'
                                                        }`} />
                                                    <span className="font-medium text-foreground/80">{inst.nome}</span>
                                                </div>
                                            ))}
                                            <DropdownMenuSeparator className="mt-2" />
                                        </div>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link href="/cursos">
                            <a>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10"
                                >
                                    <GraduationCap className="w-4 h-4 mr-2" />
                                    Cursos
                                </Button>
                            </a>
                        </Link>
                    </nav>
                </div>

                {/* User / Login Area */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-sm font-medium text-foreground">{user.username}</span>
                                <Badge variant="outline" className="text-[10px] bg-primary/10 border-primary/30 text-primary h-5 px-1.5">
                                    {user.rank.toUpperCase()}
                                </Badge>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/50 p-0 overflow-hidden transition-all">
                                        <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuLabel>
                                        {user.username}
                                        {user.instructorType !== 'none' && (
                                            <Badge className="ml-2 bg-accent text-accent-foreground text-[10px] px-1.5 py-0">
                                                Instrutor {user.instructorType}
                                            </Badge>
                                        )}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />

                                    {/* Simulation Controls - Remove in production */}
                                    <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider mt-2">
                                        Simular Acesso Externo
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem onClick={simulateJoinDiscord} className={user.memberOfDiscord ? "bg-green-500/10 text-green-500 focus:bg-green-500/20 focus:text-green-500" : ""}>
                                        <Users className="w-3 h-3 mr-2" />
                                        {user.memberOfDiscord ? "Membro do Discord (Sim)" : "Entrar no Discord"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => simulateAddRole(ROLE_CONFIG.ACCESS_ROLE_ID)} className={user.discordRoles.includes(ROLE_CONFIG.ACCESS_ROLE_ID) ? "bg-green-500/10 text-green-500 focus:bg-green-500/20 focus:text-green-500" : ""}>
                                        <Shield className="w-3 h-3 mr-2" />
                                        {user.discordRoles.includes(ROLE_CONFIG.ACCESS_ROLE_ID) ? "Cargo Verificado (Sim)" : "Obter Cargo Verificado"}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider mt-2">
                                        Simular Tipo de Usuário
                                    </DropdownMenuLabel>
                                    {(['none', 'geral', 'GRA', 'SWAT', 'GTM', 'SPEED'] as InstructorType[]).map((type) => (
                                        <DropdownMenuItem
                                            key={type}
                                            onClick={() => simulateInstructorChange(type)}
                                            className={user.instructorType === type ? "bg-accent/10 text-accent" : ""}
                                        >
                                            <GraduationCap className="w-3 h-3 mr-2" />
                                            {type === 'none' ? 'Aluno' : type === 'geral' ? 'Instrutor Geral' : `Instrutor ${type}`}
                                        </DropdownMenuItem>
                                    ))}

                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider mt-2">
                                        Simular Patente
                                    </DropdownMenuLabel>
                                    {ranks.map((rank) => (
                                        <DropdownMenuItem
                                            key={rank}
                                            onClick={() => simulateRankChange(rank)}
                                            className={user.rank === rank ? "bg-primary/10 text-primary" : ""}
                                        >
                                            <Shield className="w-3 h-3 mr-2" />
                                            {rank}
                                        </DropdownMenuItem>
                                    ))}



                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => {
                                        // Resetar cursos - hack rápido pois não expus setCompletedCourses
                                        // Idealmente teria um resetProgress() no context, mas vou iterar ou recarregar
                                        window.location.reload();
                                    }} className="text-red-400 focus:text-red-500">
                                        <LogOut className="w-3 h-3 mr-2" />
                                        Resetar Progresso (Reload)
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="text-red-400 focus:text-red-400">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Sair
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <Button
                            onClick={login}
                            disabled={isLoading}
                            className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium shadow-[0_0_15px_rgba(88,101,242,0.4)] transition-all"
                        >
                            {isLoading ? (
                                <span className="animate-spin mr-2">⏳</span>
                            ) : (
                                <LogIn className="w-4 h-4 mr-2" />
                            )}
                            {isLoading ? 'Conectando...' : 'Login com Discord'}
                        </Button>
                    )}
                </div>
            </div >
        </motion.header >
    );
}
