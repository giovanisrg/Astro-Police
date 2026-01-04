import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Edit, Save, Plus, Trash2, FileText, Download, MapPin, Clock, Info, CheckCircle2 } from "lucide-react";
import {
    InfoRecrutamento,
    MaterialEstudo,
    INITIAL_INFO_RECRUTAMENTO,
    INITIAL_MATERIAIS_ESTUDO
} from "@/data/initialData";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function EnrollmentPage() {
    const { user } = useAuth();
    const isGeneralInstructor = user?.instructorType === 'geral';

    // Estados
    const [infoRecrutamento, setInfoRecrutamento] = useState<InfoRecrutamento>(INITIAL_INFO_RECRUTAMENTO);
    const [materiais, setMateriais] = useState<MaterialEstudo[]>(INITIAL_MATERIAIS_ESTUDO);
    const [isEditingInfo, setIsEditingInfo] = useState(false);

    // Estado para novo/edição de material
    const [isAddingMaterial, setIsAddingMaterial] = useState(false); // Controls the form visibility
    const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null); // If set, we are editing this ID
    const [materialForm, setMaterialForm] = useState<Partial<MaterialEstudo>>({ titulo: '', descricao: '', pdf: '' });

    // Fetch Data
    const fetchData = async () => {
        try {
            // 1. Fetch Recruitment Info
            const { data: infoData, error: _infoError } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'recrutamento_info')
                .single();

            if (infoData?.value) {
                setInfoRecrutamento(infoData.value);
            } else {
                // Auto-seed Info
                await supabase.from('app_settings').upsert({
                    key: 'recrutamento_info',
                    value: INITIAL_INFO_RECRUTAMENTO
                });
            }

            // 2. Fetch Study Materials
            const { data: matData, error: _matError } = await supabase
                .from('study_materials')
                .select('*')
                .order('ordem', { ascending: true });

            if (matData && matData.length > 0) {
                // Map DB columns to Frontend Interface
                const mappedMaterials = matData.map(m => ({
                    id: m.id,
                    titulo: m.titulo,
                    descricao: m.descricao || '',
                    pdf: m.pdf_url,
                    ordem: m.ordem
                }));
                setMateriais(mappedMaterials);
            } else {
                // Auto-seed Materials if empty
                console.log("Seeding initial study materials...");
                // Note: We don't map mappedMaterials here to state immediately to avoid flicker,
                // but we insert into DB so next fetch works or realtime could pick it up.
                // Actually, for immediate consistency, let's just insert.
                const seedData = INITIAL_MATERIAIS_ESTUDO.map(m => ({
                    titulo: m.titulo,
                    descricao: m.descricao,
                    pdf_url: m.pdf,
                    ordem: m.ordem
                }));
                await supabase.from('study_materials').insert(seedData);
            }

        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            // Silent error mostly, as we fall back to initialData
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Funções de Gerenciamento de Info
    const handleSaveInfo = async () => {
        try {
            const { error } = await supabase
                .from('app_settings')
                .upsert({
                    key: 'recrutamento_info',
                    value: infoRecrutamento,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            setIsEditingInfo(false);
            toast.success("Informações de recrutamento atualizadas!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar informações.");
        }
    };

    // Funções de Gerenciamento de Materiais
    const openAddModal = () => {
        setMaterialForm({ titulo: '', descricao: '', pdf: '' });
        setEditingMaterialId(null);
        setIsAddingMaterial(true);
    };

    const openEditModal = (material: MaterialEstudo) => {
        setMaterialForm({
            titulo: material.titulo,
            descricao: material.descricao,
            pdf: material.pdf
        });
        setEditingMaterialId(material.id);
        setIsAddingMaterial(true); // Reusing the "Add" visibility state for the form
    };

    const handleSaveMaterial = async () => {
        if (!materialForm.titulo || !materialForm.pdf) {
            toast.error("Preencha título e link do PDF");
            return;
        }

        const payload = {
            titulo: materialForm.titulo,
            descricao: materialForm.descricao,
            pdf_url: materialForm.pdf,
            ordem: materiais.length + 1 // Simple append logic
        };

        try {
            if (editingMaterialId) {
                // UPDATE
                const { error } = await supabase
                    .from('study_materials')
                    .update(payload)
                    .eq('id', editingMaterialId);
                if (error) throw error;
                toast.success("Material atualizado!");
            } else {
                // INSERT
                const { error } = await supabase
                    .from('study_materials')
                    .insert(payload);
                if (error) throw error;
                toast.success("Material adicionado!");
            }

            setIsAddingMaterial(false);
            setEditingMaterialId(null);
            fetchData(); // Refresh list immediately
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar material.");
        }
    };

    const handleDeleteMaterial = async (id: string) => {
        if (!confirm("Tem certeza que deseja apagar este material?")) return;

        try {
            const { error } = await supabase
                .from('study_materials')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success("Material removido!");
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao remover material.");
        }
    };

    const handleDownload = (pdfUrl: string) => {
        window.open(pdfUrl, '_blank');
        toast.info("Abrindo material...");
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <Header />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="container mx-auto space-y-12"
            >


                {/* Seção de Informações de Recrutamento */}
                <Card className="glass border-primary/20 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <Info className="w-6 h-6 text-primary" />
                                Processo Seletivo
                            </CardTitle>
                            <CardDescription>Detalhes sobre o recrutamento presencial</CardDescription>
                        </div>
                        {isGeneralInstructor && (
                            <Button
                                variant={isEditingInfo ? "default" : "outline"}
                                size="sm"
                                onClick={() => isEditingInfo ? handleSaveInfo() : setIsEditingInfo(true)}
                                className={isEditingInfo ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                                {isEditingInfo ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                                {isEditingInfo ? 'Salvar Alterações' : 'Editar Informações'}
                            </Button>
                        )}
                    </CardHeader>

                    <CardContent className="space-y-8">
                        {/* Grid de Informações Básicas */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                {/* Descrição */}
                                <div className="space-y-2 col-span-2">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                                        <Info className="w-5 h-5" /> Descrição do Processo
                                    </h3>
                                    {isEditingInfo ? (
                                        <Textarea
                                            value={infoRecrutamento.descricao}
                                            onChange={e => setInfoRecrutamento({ ...infoRecrutamento, descricao: e.target.value })}
                                            className="bg-secondary/50"
                                            rows={3}
                                        />
                                    ) : (
                                        <p className="text-muted-foreground whitespace-pre-wrap">{infoRecrutamento.descricao}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                                        <MapPin className="w-5 h-5" /> Local de Apresentação
                                    </h3>
                                    {isEditingInfo ? (
                                        <Input
                                            value={infoRecrutamento.local}
                                            onChange={e => setInfoRecrutamento({ ...infoRecrutamento, local: e.target.value })}
                                            className="bg-secondary/50"
                                        />
                                    ) : (
                                        <p className="text-xl font-light">{infoRecrutamento.local}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                                        <Clock className="w-5 h-5" /> Horário
                                    </h3>
                                    {isEditingInfo ? (
                                        <Input
                                            value={infoRecrutamento.hora}
                                            onChange={e => setInfoRecrutamento({ ...infoRecrutamento, hora: e.target.value })}
                                            className="bg-secondary/50"
                                        />
                                    ) : (
                                        <p className="text-xl font-light">{infoRecrutamento.hora}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                                        <CheckCircle2 className="w-5 h-5" /> Requisitos Básicos
                                    </h3>
                                    {isEditingInfo ? (
                                        <Textarea
                                            value={infoRecrutamento.requisitos.join('\n')}
                                            onChange={(e) => setInfoRecrutamento({ ...infoRecrutamento, requisitos: e.target.value.split('\n') })}
                                            className="bg-secondary/50 font-mono text-sm"
                                            rows={6}
                                            placeholder="Digite cada requisito em uma nova linha"
                                        />
                                    ) : (
                                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                            {infoRecrutamento.requisitos.map((req, idx) => (
                                                <li key={idx}>{req}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Fardamentos */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-center mb-4">Fardamento Padrão para Recrutamento</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Masculino */}
                                    <div className="space-y-2">
                                        <div className="aspect-[3/4] rounded-lg overflow-hidden border border-border relative bg-black/20 group">
                                            <img
                                                src={infoRecrutamento.fotoMasculino}
                                                alt="Fardamento Masculino"
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-2">
                                                <span className="text-white font-medium text-sm">Masculino</span>
                                            </div>
                                        </div>
                                        {isEditingInfo && (
                                            <Input
                                                placeholder="URL Foto Masculina"
                                                value={infoRecrutamento.fotoMasculino}
                                                onChange={e => setInfoRecrutamento({ ...infoRecrutamento, fotoMasculino: e.target.value })}
                                                className="text-xs"
                                            />
                                        )}
                                    </div>

                                    {/* Feminino */}
                                    <div className="space-y-2">
                                        <div className="aspect-[3/4] rounded-lg overflow-hidden border border-border relative bg-black/20 group">
                                            <img
                                                src={infoRecrutamento.fotoFeminino}
                                                alt="Fardamento Feminino"
                                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-2">
                                                <span className="text-white font-medium text-sm">Feminino</span>
                                            </div>
                                        </div>
                                        {isEditingInfo && (
                                            <Input
                                                placeholder="URL Foto Feminina"
                                                value={infoRecrutamento.fotoFeminino}
                                                onChange={e => setInfoRecrutamento({ ...infoRecrutamento, fotoFeminino: e.target.value })}
                                                className="text-xs"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Seção de Materiais de Estudo */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                <FileText className="w-8 h-8 text-primary" />
                                Materiais de Estudo
                            </h2>
                            <p className="text-muted-foreground mt-1">
                                Documentação oficial e guias de estudo para o exame teórico.
                            </p>
                        </div>
                        {isGeneralInstructor && !isAddingMaterial && (
                            <Button onClick={openAddModal} className="bg-primary text-primary-foreground">
                                <Plus className="w-4 h-4 mr-2" /> Adicionar Material
                            </Button>
                        )}
                    </div>

                    {/* Formulário de Adicionar Material */}
                    <AnimatePresence>
                        {isAddingMaterial && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <Card className="border-primary/50 bg-primary/5 mb-8">
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            {editingMaterialId ? 'Editar Material' : 'Novo Material'}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Título do Material</label>
                                                <Input
                                                    value={materialForm.titulo}
                                                    onChange={e => setMaterialForm({ ...materialForm, titulo: e.target.value })}
                                                    placeholder="Ex: Código Penal 2024"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Link do PDF/Documento</label>
                                                <Input
                                                    value={materialForm.pdf}
                                                    onChange={e => setMaterialForm({ ...materialForm, pdf: e.target.value })}
                                                    placeholder="Ex: https://..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Descrição Curta</label>
                                            <Input
                                                value={materialForm.descricao}
                                                onChange={e => setMaterialForm({ ...materialForm, descricao: e.target.value })}
                                                placeholder="Breve descrição do conteúdo..."
                                            />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-2">
                                            <Button variant="ghost" onClick={() => setIsAddingMaterial(false)}>Cancelar</Button>
                                            <Button onClick={handleSaveMaterial}>
                                                {editingMaterialId ? 'Atualizar Material' : 'Salvar Material'}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Lista de Materiais */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {materiais.map((material) => (
                            <motion.div
                                key={material.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <Card className="h-full glass hover:border-primary/40 transition-all duration-300 group flex flex-col">
                                    <CardHeader>
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                            {isGeneralInstructor && (
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-muted-foreground hover:text-primary"
                                                        onClick={() => openEditModal(material)}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleDeleteMaterial(material.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <CardTitle className="mt-4 text-xl leading-tight">{material.titulo}</CardTitle>
                                        <CardDescription className="line-clamp-2">{material.descricao}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="mt-auto pt-0">
                                        <Button
                                            className="w-full group/btn"
                                            variant="secondary"
                                            onClick={() => handleDownload(material.pdf)}
                                        >
                                            Baixar PDF
                                            <Download className="w-4 h-4 ml-2 group-hover/btn:translate-y-1 transition-transform" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {materiais.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl border border-dashed border-border">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">Nenhum material de estudo disponível no momento.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
