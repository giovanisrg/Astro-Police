import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Plus, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Curso } from "@/data/initialData";
import { ROLE_CONFIG } from "@/config/roles";

interface CourseEditorModalProps {
    cursoToEdit?: Curso | null;
    defaultGuarnicao?: 'GRA' | 'SWAT' | 'GTM' | 'SPEED';
    onClose: () => void;
    onSave: (curso: Curso) => void;
}

export function CourseEditorModal({ cursoToEdit, defaultGuarnicao, onClose, onSave }: CourseEditorModalProps) {
    const [formData, setFormData] = useState<Partial<Curso>>({
        id: crypto.randomUUID(),
        nome: "",
        descricao: "",
        cargaHoraria: "100h",
        modulos: [],
        minLevel: 0,
        guarnicao: defaultGuarnicao,
        progressao: "N/A",
        pdf: "#"
    });

    const [newModule, setNewModule] = useState("");

    useEffect(() => {
        if (cursoToEdit) {
            setFormData(cursoToEdit);
        }
    }, [cursoToEdit]);

    const handleSave = () => {
        if (!formData.nome || !formData.descricao) {
            toast.error("Preencha os campos obrigatórios");
            return;
        }
        onSave(formData as Curso);
        onClose();
        toast.success(cursoToEdit ? "Curso atualizado!" : "Curso criado!");
    };

    const addModule = () => {
        if (!newModule) return;
        setFormData(prev => ({ ...prev, modulos: [...(prev.modulos || []), newModule] }));
        setNewModule("");
    };

    const removeModule = (index: number) => {
        setFormData(prev => ({
            ...prev,
            modulos: prev.modulos?.filter((_, i) => i !== index)
        }));
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
                onClick={onClose}
            >
                <div
                    className="w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Card className="bg-background border-primary/50 shadow-[0_0_40px_rgba(0,217,255,0.2)]">
                        <CardHeader className="border-b border-white/10">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    {cursoToEdit ? "Editar Curso" : "Novo Curso"}
                                </CardTitle>
                                <Button variant="ghost" size="icon" onClick={onClose}>
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nome do Curso *</Label>
                                    <Input
                                        value={formData.nome}
                                        onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                        className="bg-secondary/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Carga Horária</Label>
                                    <Input
                                        value={formData.cargaHoraria}
                                        onChange={e => setFormData({ ...formData, cargaHoraria: e.target.value })}
                                        className="bg-secondary/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Descrição *</Label>
                                <Textarea
                                    value={formData.descricao}
                                    onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                                    className="bg-secondary/50"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nível Mínimo</Label>
                                    <Select
                                        value={String(formData.minLevel)}
                                        onValueChange={v => setFormData({ ...formData, minLevel: Number(v) })}
                                    >
                                        <SelectTrigger className="bg-secondary/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ROLE_CONFIG.PATENTES.map((patente) => (
                                                <SelectItem key={patente.id} value={String(patente.level)}>
                                                    {patente.nome} {patente.level === 0 ? "(Livre)" : ""}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Guarnição (Opcional)</Label>
                                    <Select
                                        value={formData.guarnicao || "none"}
                                        onValueChange={v => setFormData({ ...formData, guarnicao: v === "none" ? undefined : v as any })}
                                    >
                                        <SelectTrigger className="bg-secondary/50">
                                            <SelectValue placeholder="Nenhuma" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none"> - Geral - </SelectItem>
                                            <SelectItem value="GRA">GRA</SelectItem>
                                            <SelectItem value="SWAT">SWAT</SelectItem>
                                            <SelectItem value="GTM">GTM</SelectItem>
                                            <SelectItem value="SPEED">SPEED</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Campos Personalizados: Progressão e PDF */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-2 border-t border-b border-white/5">
                                <div className="space-y-2">
                                    <Label>Progressão</Label>
                                    <Input
                                        value={formData.progressao || ""}
                                        onChange={e => setFormData({ ...formData, progressao: e.target.value })}
                                        placeholder="Ex: Recruta → Soldado"
                                        className="bg-secondary/50 border-blue-500/30 text-blue-400 placeholder:text-blue-500/30"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Aparece em destaque no card.</p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Link do PDF (Discord/Drive)</Label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <Upload className="w-4 h-4" />
                                            </div>
                                            <Input
                                                value={formData.pdf === '#' ? '' : formData.pdf}
                                                onChange={e => setFormData({ ...formData, pdf: e.target.value })}
                                                placeholder="https://..."
                                                className="pl-9 bg-secondary/50"
                                            />
                                        </div>
                                        {formData.pdf && formData.pdf !== '#' && (
                                            <Button size="icon" variant="ghost" className="shrink-0" onClick={() => window.open(formData.pdf, '_blank')}>
                                                <FileText className="w-4 h-4 text-primary" />
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground pt-1">
                                        Hospede o PDF no Discord ou Google Drive e cole o link aqui.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Módulos do Curso</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newModule}
                                        onChange={e => setNewModule(e.target.value)}
                                        placeholder="Adicionar módulo..."
                                        className="bg-secondary/50"
                                    />
                                    <Button onClick={addModule} size="icon" className="shrink-0 bg-primary/20 hover:bg-primary/40 text-primary border border-primary/50">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="space-y-1 max-h-40 overflow-y-auto p-1">
                                    {formData.modulos?.map((mod, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 rounded bg-accent/5 border border-white/5 text-sm">
                                            <span>{mod}</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-500" onClick={() => removeModule(i)}>
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 flex justify-end gap-2">
                                <Button variant="outline" onClick={onClose}>Cancelar</Button>
                                <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    <Save className="w-4 h-4 mr-2" />
                                    Salvar Alterações
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
