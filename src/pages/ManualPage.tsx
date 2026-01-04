import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Save, ArrowLeft, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ROLE_CONFIG } from "@/config/roles";

interface ManualModule {
    title: string;
    content: string;
}

interface ManualData {
    title: string;
    subtitle: string;
    modules: ManualModule[];
}

const INITIAL_MANUAL: ManualData = {
    title: "MANUAL TÉCNICO",
    subtitle: "Carregando...",
    modules: []
};

export default function ManualPage() {
    // wouter integration
    const [match, params] = useRoute("/manual/:manualId");
    const manualId = match && params ? params.manualId : "gra";

    // Back button handler
    const handleBack = () => {
        window.history.back();
    };

    const [data, setData] = useState<ManualData>(INITIAL_MANUAL);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Permission Check: Admin or Instructor of the specific manual
    // Assuming manualId 'gra' corresponds to instructorType 'GRA' etc.
    // Also Global Admins.
    const canEdit = user && (
        (user.discordRoles && ROLE_CONFIG.INSTRUTORES.GERAL.ids.some(id => user.discordRoles.includes(id))) ||
        (user.instructorType && user.instructorType.toLowerCase() === manualId?.toLowerCase())
    );

    useEffect(() => {
        fetchManual();
    }, [manualId]);

    const fetchManual = async () => {
        setIsLoading(true);
        const { data: settings, error } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', `manual_${manualId}`)
            .single();

        if (error || !settings) {
            console.error("Error fetching manual:", error);
            // Optionally handle 404
        } else {
            setData(settings.value);
        }
        setIsLoading(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('app_settings')
                .upsert({
                    key: `manual_${manualId}`,
                    value: data,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            toast.success("Manual atualizado com sucesso!");
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao salvar manual.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleModuleChange = (index: number, field: 'title' | 'content', value: string) => {
        const newModules = [...data.modules];
        newModules[index] = { ...newModules[index], [field]: value };
        setData({ ...data, modules: newModules });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-sans overflow-y-auto">
            {/* Toolbar */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur border-b border-primary/20 flex items-center justify-between px-6 z-50 rounded-b-xl">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary" onClick={handleBack}>
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar
                </Button>

                <div className="flex items-center gap-4">
                    {canEdit && !isEditing && (
                        <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10" onClick={() => setIsEditing(true)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Editar Manual
                        </Button>
                    )}
                    {isEditing && (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" onClick={() => { setIsEditing(false); fetchManual(); }}>
                                Cancelar
                            </Button>
                            <Button className="bg-primary text-black hover:bg-primary/80 font-bold" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Salvar Alterações
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* A4 Paper Effect */}
            <div className="pt-24 pb-20 px-4 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[210mm] min-h-[297mm] bg-[#131313] border border-[#333] shadow-2xl p-[20mm] relative rounded-lg"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center border-b-2 border-primary pb-5 mb-10">
                        <div>
                            <h1 className="font-[Orbitron] text-primary text-2xl tracking-wide font-bold">ASTRO POLICE</h1>
                            <p className="text-[#888] tracking-[0.2em] text-xs uppercase">Academia de Polícia • Divisão {manualId?.toUpperCase()}</p>
                        </div>
                        <div className="font-[Orbitron] bg-primary/10 text-primary px-4 py-1 border border-primary rounded text-sm">
                            MANUAL OFICIAL v3.0
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-12">
                        {isEditing ? (
                            <div className="space-y-4">
                                <Input
                                    value={data.title}
                                    onChange={(e) => setData({ ...data, title: e.target.value })}
                                    className="text-center text-3xl font-[Orbitron] font-bold bg-transparent border-primary/50 h-auto py-2"
                                />
                                <Input
                                    value={data.subtitle}
                                    onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                                    className="text-center text-xl text-primary bg-transparent border-primary/30"
                                />
                            </div>
                        ) : (
                            <>
                                <h1 className="font-[Orbitron] text-4xl font-bold text-white mb-2">{data.title}</h1>
                                <p className="text-primary text-xl uppercase tracking-widest">{data.subtitle}</p>
                            </>
                        )}
                    </div>

                    {/* Modules */}
                    <div className="space-y-12">
                        {data.modules.map((module, index) => (
                            <div key={index}>
                                {isEditing ? (
                                    <div className="p-4 border border-white/10 rounded-lg bg-black/20 mb-8">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="font-[Orbitron] text-secondary text-2xl opacity-50">#{index + 1}</span>
                                            <Input
                                                value={module.title}
                                                onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                                                className="bg-transparent border-white/20 font-bold text-lg"
                                                placeholder="Título do Módulo"
                                            />
                                        </div>
                                        <Textarea
                                            value={module.content}
                                            onChange={(e) => handleModuleChange(index, 'content', e.target.value)}
                                            className="bg-transparent border-white/20 min-h-[150px] font-sans leading-relaxed"
                                            placeholder="Conteúdo do módulo..."
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="font-[Orbitron] text-white text-2xl border-l-4 border-secondary pl-4 mb-6 flex items-center">
                                            <span className="text-secondary opacity-70 mr-4 text-3xl">0{index + 1}</span>
                                            {module.title}
                                        </h2>
                                        <div className="text-[#ccc] text-lg leading-relaxed whitespace-pre-wrap pl-4">
                                            {module.content}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-[20mm] left-[20mm] right-[20mm] border-t border-[#333] pt-4 flex justify-between text-xs text-[#666] font-[Orbitron]">
                        <span>ASTRO POLICE DEPT.</span>
                        <span>DOCUMENTO CONFIDENCIAL</span>
                    </div>

                </motion.div>
            </div>
        </div>
    );
}
