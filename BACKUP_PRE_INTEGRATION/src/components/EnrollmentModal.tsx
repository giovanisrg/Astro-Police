import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Rank } from "@/contexts/AuthContext";

interface Curso {
    id: string;
    nome: string;
}

interface EnrollmentModalProps {
    curso: Curso;
    onClose: () => void;
    onSuccess?: () => void;
}

interface EnrollmentFormData {
    qra: string;
    rank: Rank;
    paymentProof: File | null;
}

export function EnrollmentModal({ curso, onClose, onSuccess }: EnrollmentModalProps) {
    const [formData, setFormData] = useState<EnrollmentFormData>({
        qra: "",
        rank: "Recruta",
        paymentProof: null,
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const ranks: Rank[] = ["Recruta", "Soldado", "Sargento", "Subtenente", "Capitão", "Major"];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de arquivo
        if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
            setErrors({ ...errors, paymentProof: "Apenas imagens PNG ou JPG são aceitas" });
            return;
        }

        // Validar tamanho (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setErrors({ ...errors, paymentProof: "Arquivo deve ter no máximo 5MB" });
            return;
        }

        setFormData({ ...formData, paymentProof: file });
        setErrors({ ...errors, paymentProof: "" });

        // Criar preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.qra || formData.qra.length < 3) {
            newErrors.qra = "QRA deve ter no mínimo 3 caracteres";
        }

        if (!formData.rank) {
            newErrors.rank = "Selecione uma patente";
        }

        if (!formData.paymentProof) {
            newErrors.paymentProof = "Comprovante de pagamento é obrigatório";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Por favor, preencha todos os campos corretamente");
            return;
        }

        setIsSubmitting(true);

        // Simular envio (em produção, aqui seria uma chamada API)
        setTimeout(() => {
            console.log("Matrícula enviada:", {
                curso: curso.id,
                qra: formData.qra,
                rank: formData.rank,
                paymentProof: formData.paymentProof?.name,
            });

            toast.success("Matrícula enviada com sucesso! Aguarde aprovação.", {
                description: `Curso: ${curso.nome}`,
            });

            setIsSubmitting(false);
            if (onSuccess) onSuccess();
            onClose();
        }, 1500);
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
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-2xl"
                >
                    <Card className="relative bg-background border border-primary/50 shadow-[0_0_40px_rgba(0,217,255,0.4)]">
                        {/* Decorative top border */}
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

                        {/* Close button */}
                        <div className="absolute top-4 right-4 z-10">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="hover:bg-primary/20 rounded-full"
                            >
                                <X className="w-6 h-6 text-muted-foreground hover:text-primary" />
                            </Button>
                        </div>

                        <CardHeader className="pt-10 pb-6 border-b border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                                    <FileText className="w-8 h-8 text-primary glow" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                                        Matrícula no Curso
                                    </CardTitle>
                                    <CardDescription className="text-base text-muted-foreground mt-1">
                                        {curso.nome}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* QRA */}
                                <div className="space-y-2">
                                    <Label htmlFor="qra" className="text-sm font-semibold uppercase tracking-wider text-foreground">
                                        QRA (Identificação) *
                                    </Label>
                                    <Input
                                        id="qra"
                                        type="text"
                                        placeholder="Ex: QRA-12345"
                                        value={formData.qra}
                                        onChange={(e) => setFormData({ ...formData, qra: e.target.value })}
                                        className={`bg-secondary/50 border-primary/20 focus:border-primary ${errors.qra ? "border-destructive" : ""
                                            }`}
                                    />
                                    {errors.qra && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.qra}
                                        </p>
                                    )}
                                </div>

                                {/* Patente */}
                                <div className="space-y-2">
                                    <Label htmlFor="rank" className="text-sm font-semibold uppercase tracking-wider text-foreground">
                                        Patente *
                                    </Label>
                                    <Select
                                        value={formData.rank}
                                        onValueChange={(value) => setFormData({ ...formData, rank: value as Rank })}
                                    >
                                        <SelectTrigger className="bg-secondary/50 border-primary/20 focus:border-primary">
                                            <SelectValue placeholder="Selecione sua patente" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ranks.map((rank) => (
                                                <SelectItem key={rank} value={rank}>
                                                    {rank}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.rank && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.rank}
                                        </p>
                                    )}
                                </div>

                                {/* Comprovante de Pagamento */}
                                <div className="space-y-2">
                                    <Label htmlFor="payment" className="text-sm font-semibold uppercase tracking-wider text-foreground">
                                        Comprovante de Pagamento *
                                    </Label>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Input
                                                id="payment"
                                                type="file"
                                                accept="image/png,image/jpeg,image/jpg"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById("payment")?.click()}
                                                className="w-full border-primary/20 hover:bg-primary/10"
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                {formData.paymentProof ? "Alterar arquivo" : "Escolher arquivo"}
                                            </Button>
                                        </div>

                                        {formData.paymentProof && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                                <span>{formData.paymentProof.name}</span>
                                                <span className="text-xs">
                                                    ({(formData.paymentProof.size / 1024).toFixed(0)} KB)
                                                </span>
                                            </div>
                                        )}

                                        {previewUrl && (
                                            <div className="relative rounded-lg overflow-hidden border border-primary/20">
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview do comprovante"
                                                    className="w-full h-48 object-cover"
                                                />
                                            </div>
                                        )}

                                        {errors.paymentProof && (
                                            <p className="text-sm text-destructive flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.paymentProof}
                                            </p>
                                        )}

                                        <p className="text-xs text-muted-foreground">
                                            Formatos aceitos: PNG, JPG • Tamanho máximo: 5MB
                                        </p>
                                    </div>
                                </div>

                                {/* Botões */}
                                <div className="flex gap-3 pt-6 border-t border-primary/10">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
                                        className="flex-1 border-primary/20 hover:bg-primary/10"
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold glow-hover shadow-[0_0_20px_rgba(0,217,255,0.2)]"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="animate-spin mr-2">⏳</span>
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Enviar Matrícula
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
