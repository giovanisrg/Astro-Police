import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Users, Crosshair, Zap, Bike } from "lucide-react";
import { INITIAL_INSTRUTORES, Instrutor } from "@/data/initialData";

export default function InstructorsPage() {
    const { user } = useAuth();

    const [activeFilter, setActiveFilter] = useState<'Todos' | 'Geral' | 'GRA' | 'SWAT' | 'GTM' | 'SPEED'>('Todos');
    const [instrutores, setInstrutores] = useState<Instrutor[]>(INITIAL_INSTRUTORES);

    // Ler hash da URL para filtrar inicialmente
    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash && ['Geral', 'GRA', 'SWAT', 'GTM', 'SPEED'].includes(hash)) {
            setActiveFilter(hash as any);
        }
    }, []);

    // Filtrar instrutores
    const filteredInstructors = activeFilter === 'Todos'
        ? instrutores
        : instrutores.filter(inst => inst.cargo === activeFilter);

    const categories = [
        { id: 'Todos', label: 'Todos', icon: Users },
        { id: 'Geral', label: 'Geral', icon: Shield },
        { id: 'GRA', label: 'GRA', icon: Shield },
        { id: 'SWAT', label: 'SWAT', icon: Crosshair },
        { id: 'GTM', label: 'GTM', icon: Bike },
        { id: 'SPEED', label: 'SPEED', icon: Zap },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <Header />

            <div className="container mx-auto space-y-12">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground glow">
                        CORPO DE INSTRUTORES
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Conheça os responsáveis por formar a elite da Astro Police.
                    </p>
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap justify-center gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveFilter(cat.id as any);
                                window.location.hash = cat.id === 'Todos' ? '' : cat.id;
                            }}
                            className={`
                                flex items-center gap-2 px-6 py-2 rounded-full transition-all duration-300 font-medium text-sm
                                ${activeFilter === cat.id
                                    ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,217,255,0.5)] scale-105'
                                    : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'}
                            `}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Grid de Instrutores */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredInstructors.map((instrutor) => (
                            <motion.div
                                key={instrutor.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Card className="glass h-full border-primary/20 hover:border-primary/50 transition-colors group overflow-hidden">
                                    <div className={`h-2 w-full ${instrutor.status === 'online' ? 'bg-green-500' :
                                            instrutor.status === 'ocupado' ? 'bg-yellow-500' : 'bg-slate-700'
                                        }`} />
                                    <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">

                                        {/* Avatar com Status Ring */}
                                        <div className="relative">
                                            <Avatar className="w-24 h-24 border-2 border-border group-hover:border-primary transition-colors">
                                                <AvatarImage src={instrutor.avatar} />
                                                <AvatarFallback>{instrutor.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-background ${instrutor.status === 'online' ? 'bg-green-500' :
                                                    instrutor.status === 'ocupado' ? 'bg-yellow-500' : 'bg-slate-500'
                                                }`} title={instrutor.status} />
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="text-xl font-bold leading-tight">{instrutor.nome}</h3>
                                            <p className="text-sm text-primary font-medium">{instrutor.patente}</p>
                                        </div>

                                        <Badge variant="outline" className="bg-secondary/50">
                                            {instrutor.cargo === 'Geral' ? 'Instrutor Geral' : `Guarnição ${instrutor.cargo}`}
                                        </Badge>

                                        {instrutor.bio && (
                                            <p className="text-sm text-muted-foreground line-clamp-3">
                                                "{instrutor.bio}"
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredInstructors.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Nenhum instrutor encontrado nesta categoria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
