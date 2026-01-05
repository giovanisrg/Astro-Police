import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Save, Edit2 } from "lucide-react";
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

    const { user } = useAuth();
    // Back button removed as requested

    const [data, setData] = useState<ManualData>(INITIAL_MANUAL);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Permission Check
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
            // Fallback for empty manual (allows creating new ones)
            setData({
                title: `MANUAL ${manualId?.toUpperCase()}`,
                subtitle: "DOCUMENTO OFICIAL",
                modules: [
                    { title: "Introdução", content: "Conteúdo inicial..." }
                ]
            });
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
                }, { onConflict: 'key' });

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

    // Helper to render "Markdown-like" content to match the PDF look
    const renderContent = (text: string) => {
        if (!text) return null;

        return text.split('\n\n').map((block, idx) => {
            // Check for list items
            if (block.trim().startsWith('- ')) {
                const items = block.split('\n').filter(line => line.trim().startsWith('- '));
                return (
                    <ul key={idx} className="list-none pl-5 my-4 space-y-2">
                        {items.map((item, i) => (
                            <li key={i} className="text-[#ccc] relative before:content-['•'] before:text-primary before:font-bold before:absolute before:-left-4">
                                <span dangerouslySetInnerHTML={{ __html: parseBold(item.replace('- ', '')) }} />
                            </li>
                        ))}
                    </ul>
                );
            }

            // Check for Warning Box [WARNING]
            if (block.includes('[WARNING]')) {
                const content = block.replace('[WARNING]', '').trim();
                return (
                    <div key={idx} className="bg-[rgba(255,50,50,0.05)] border border-[rgba(255,50,50,0.2)] p-4 rounded-lg my-4">
                        <span dangerouslySetInnerHTML={{ __html: parseBold(content) }} className="text-[#ccc]" />
                    </div>
                );
            }

            // Check for Info Box [INFO]
            if (block.includes('[INFO]')) {
                const content = block.replace('[INFO]', '').trim();
                return (
                    <div key={idx} className="bg-[rgba(112,0,255,0.05)] border border-[rgba(112,0,255,0.2)] p-4 rounded-lg my-4">
                        <span dangerouslySetInnerHTML={{ __html: parseBold(content) }} className="text-[#ccc]" />
                    </div>
                );
            }

            // Regular Paragraph
            return (
                <p key={idx} className="text-[#ccc] leading-relaxed mb-4">
                    <span dangerouslySetInnerHTML={{ __html: parseBold(block) }} />
                </p>
            );
        });
    };

    const parseBold = (text: string) => {
        // Simple regex for **bold** -> <strong>bold</strong>
        return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0] font-sans overflow-y-auto print:bg-white print:text-black">
            {/* Toolbar (Hidden in Print) */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur border-b border-primary/20 flex items-center justify-end px-6 z-50 rounded-b-xl print:hidden">
                <div className="flex items-center gap-4">
                    {canEdit && !isEditing && (
                        <div className="flex gap-2">
                            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10" onClick={() => window.print()}>
                                📠 Imprimir / PDF
                            </Button>
                            <Button variant="default" className="bg-primary text-black hover:bg-primary/80" onClick={() => setIsEditing(true)}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Editar Manual
                            </Button>
                        </div>
                    )}
                    {isEditing && (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" onClick={() => { setIsEditing(false); fetchManual(); }}>
                                Cancelar
                            </Button>
                            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold" onClick={handleSave} disabled={isSaving}>
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Salvar Alterações
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* A4 Paper Effect */}
            <div className="pt-24 pb-20 px-4 flex justify-center print:p-0 print:block">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-[210mm] min-h-[297mm] bg-[#131313] border border-[#333] shadow-2xl p-[20mm] relative rounded-lg print:shadow-none print:border-none print:w-full print:max-w-none print:bg-white print:text-black print:min-h-0"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center border-b-2 border-primary pb-5 mb-10 print:border-black">
                        <div>
                            <h1 className="font-[Orbitron] text-primary text-2xl tracking-wide font-bold print:text-black">ASTRO POLICE</h1>
                            <p className="text-[#888] tracking-[0.2em] text-xs uppercase print:text-gray-600">Academia de Polícia • Divisão {manualId?.toUpperCase()}</p>
                        </div>
                        <div className="font-[Orbitron] bg-primary/10 text-primary px-4 py-1 border border-primary rounded text-sm print:border-black print:text-black print:bg-transparent">
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
                                <h1 className="font-[Orbitron] text-4xl font-bold text-white mb-2 print:text-black">{data.title}</h1>
                                <p className="text-primary text-xl uppercase tracking-widest print:text-black">{data.subtitle}</p>
                            </>
                        )}
                    </div>

                    {/* Modules */}
                    <div className="space-y-8">
                        {data.modules.map((module, index) => (
                            <div key={index}>
                                {isEditing ? (
                                    <div className="p-4 border border-white/10 rounded-lg bg-black/20 mb-8 relative group">
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="destructive" size="icon" onClick={() => {
                                                const newModules = data.modules.filter((_, i) => i !== index);
                                                setData({ ...data, modules: newModules });
                                            }}>
                                                <span className="sr-only">Remover</span>
                                                X
                                            </Button>
                                        </div>
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
                                            placeholder="Use **negrito**, - lista, [INFO] ou [WARNING] para formatar..."
                                        />
                                        <p className="text-xs text-muted-foreground mt-2 text-right">
                                            Suporta: <strong>**negrito**</strong>, <span className="text-primary">- lista</span>, [INFO], [WARNING]
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="font-[Orbitron] text-white text-2xl border-l-4 border-secondary pl-4 mb-6 flex items-center print:text-black print:border-black">
                                            <span className="text-secondary opacity-70 mr-4 text-3xl print:text-black">0{index + 1}</span>
                                            {module.title}
                                        </h2>
                                        <div className="pl-4 print:text-black">
                                            {renderContent(module.content)}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {isEditing && (
                        <Button variant="outline" className="w-full mt-8 border-dashed border-primary/30 hover:border-primary text-primary" onClick={() => setData({ ...data, modules: [...data.modules, { title: "Novo Módulo", content: "" }] })}>
                            + Adicionar Módulo
                        </Button>
                    )}

                    {/* Official Seal */}
                    <div className="mt-12 text-center opacity-50 flex flex-col items-center justify-center print:opacity-100">
                        <img src="/img/logo.png" alt="Astro Police Logo" className="w-24 h-auto filter grayscale print:filter-none mb-3" />
                        <p className="text-[10px] uppercase font-[Orbitron] tracking-widest text-muted-foreground print:text-gray-500">
                            Aprovado pelo Comando Geral
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-[20mm] left-[20mm] right-[20mm] border-t border-[#333] pt-4 flex justify-between text-xs text-[#666] font-[Orbitron] print:bottom-0 print:left-0 print:right-0 print:border-black print:text-black">
                        <span>ASTRO POLICE DEPT.</span>
                        <span>DOCUMENTO CONFIDENCIAL • ACESSO RESTRITO</span>
                    </div>

                </motion.div>
            </div>

            <style>{`
                @media print {
                    @page { margin: 0; }
                    body { background: white; -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}
