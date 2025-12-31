import { useState } from "react";
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

export default function EnrollmentPage() {
    const { user } = useAuth();
    const isGeneralInstructor = user?.instructorType === 'geral';

    // Estados
    const [infoRecrutamento, setInfoRecrutamento] = useState<InfoRecrutamento>(INITIAL_INFO_RECRUTAMENTO);
    const [materiais, setMateriais] = useState<MaterialEstudo[]>(INITIAL_MATERIAIS_ESTUDO);
    const [isEditingInfo, setIsEditingInfo] = useState(false);

    // Estado para novo material
    const [isAddingMaterial, setIsAddingMaterial] = useState(false);
    const [newMaterial, setNewMaterial] = useState<Partial<MaterialEstudo>>({ titulo: '', descricao: '', pdf: '' });

    // Funções de Gerenciamento de Info
    const handleSaveInfo = () => {
        setIsEditingInfo(false);
        toast.success("Informações de recrutamento atualizadas!");
        // Aqui você salvaria no backend
    };

    // Funções de Gerenciamento de Materiais
    const handleAddMaterial = () => {
        if (!newMaterial.titulo || !newMaterial.pdf) {
            toast.error("Preencha título e link do PDF");
            return;
        }

        const material: MaterialEstudo = {
            id: `mat-${Date.now()}`,
            titulo: newMaterial.titulo,
            descricao: newMaterial.descricao || '',
            pdf: newMaterial.pdf,
            ordem: materiais.length + 1
        };

        setMateriais([...materiais, material]);
        setNewMaterial({ titulo: '', descricao: '', pdf: '' });
        setIsAddingMaterial(false);
        toast.success("Material adicionado com sucesso!");
    };

    const handleDeleteMaterial = (id: string) => {
        setMateriais(materiais.filter(m => m.id !== id));
        toast.success("Material removido!");
    };

    const handleDownload = (pdfUrl: string) => {
        // Simulação de download
        window.open(pdfUrl, '_blank');
        toast.info("Iniciando download...");
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
                            <Button onClick={() => setIsAddingMaterial(true)} className="bg-primary text-primary-foreground">
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
                                        <CardTitle className="text-lg">Novo Material</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Título do Material</label>
                                                <Input
                                                    value={newMaterial.titulo}
                                                    onChange={e => setNewMaterial({ ...newMaterial, titulo: e.target.value })}
                                                    placeholder="Ex: Código Penal 2024"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Link do PDF/Documento</label>
                                                <Input
                                                    value={newMaterial.pdf}
                                                    onChange={e => setNewMaterial({ ...newMaterial, pdf: e.target.value })}
                                                    placeholder="Ex: https://..."
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Descrição Curta</label>
                                            <Input
                                                value={newMaterial.descricao}
                                                onChange={e => setNewMaterial({ ...newMaterial, descricao: e.target.value })}
                                                placeholder="Breve descrição do conteúdo..."
                                            />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-2">
                                            <Button variant="ghost" onClick={() => setIsAddingMaterial(false)}>Cancelar</Button>
                                            <Button onClick={handleAddMaterial}>Salvar Material</Button>
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
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleDeleteMaterial(material.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
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
