import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, LogIn, LogOut, GraduationCap } from "lucide-react";
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

import { Badge } from "@/components/ui/badge";

import { ROLE_CONFIG } from "@/config/roles";

export function Header({ enrollmentStatus = 'aberto' }: { enrollmentStatus?: 'aberto' | 'fechado' }) {
    const { user, login, logout, isLoading } = useAuth(); // Removed unused simulators

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
                                <img src="/img/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(0,217,255,0.8)]" />
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




                        {/* Botão de Recrutamento - Recrutadores ou Admins */}
                        {/* Botão de Recrutamento - Recrutadores ou Admins (Geral) */}
                        {(user?.discordRoles.includes(ROLE_CONFIG.INSTRUTORES.RECRUTADOR) ||
                            ROLE_CONFIG.INSTRUTORES.GERAL.ids.some(id => user?.discordRoles.includes(id))) && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10"
                                        >
                                            Recrutamento
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <Link href="/recrutamento/prova">
                                            <DropdownMenuItem className="cursor-pointer">
                                                <span className="mr-2">📝</span> Aplicar Prova
                                            </DropdownMenuItem>
                                        </Link>
                                        <Link href="/recrutamento/resultados">
                                            <DropdownMenuItem className="cursor-pointer">
                                                <span className="mr-2">📊</span> Resultados
                                            </DropdownMenuItem>
                                        </Link>

                                        {/* Apenas Admins podem ver o gerenciador de perguntas */}
                                        {ROLE_CONFIG.INSTRUTORES.GERAL.ids.some(id => user?.discordRoles.includes(id)) && (
                                            <>
                                                <DropdownMenuSeparator />
                                                <Link href="/recrutamento/perguntas">
                                                    <DropdownMenuItem className="cursor-pointer">
                                                        <span className="mr-2">⚙️</span> Gerenciar Perguntas
                                                    </DropdownMenuItem>
                                                </Link>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

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

                                    <DropdownMenuItem onClick={() => {
                                        // Limpar cache do Discord e recarregar
                                        localStorage.removeItem('discord_member_data');
                                        localStorage.removeItem('discord_member_cache_time');
                                        window.location.reload();
                                    }} className="text-blue-400 focus:text-blue-500 cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                                        Atualizar Permissões
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem onClick={logout} className="text-red-400 focus:text-red-400 cursor-pointer">
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
