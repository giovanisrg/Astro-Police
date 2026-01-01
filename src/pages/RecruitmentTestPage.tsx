import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { WEBHOOK_CONFIG } from "@/config/webhooks";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

interface Question {
    id: number;
    text: string;
    score: number | null; // null = not answered, 1.0, 0.5, 0.0
}



export default function RecruitmentTestPage() {
    const { user } = useAuth();
    const [recruitId, setRecruitId] = useState("");
    const [recruitName, setRecruitName] = useState("");
    const [observation, setObservation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize questions state as empty array first
    const [questions, setQuestions] = useState<Question[]>([]);

    const [errors, setErrors] = useState({ id: false, name: false });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        const { data } = await supabase
            .from('recruitment_questions')
            .select('*')
            .eq('active', true)
            .order('id', { ascending: true });

        if (data) {
            setQuestions(data.map(q => ({ id: q.id, text: q.text, score: null })));
        }
    };

    const totalScore = questions.reduce((acc, q) => acc + (q.score || 0), 0);
    const isApto = totalScore >= 6.5;

    const handleScoreChange = (id: number, score: number) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, score } : q));
    };

    const handleSubmit = async () => {
        if (!user) return;

        // Reset previous errors
        setErrors({ id: false, name: false });

        if (!recruitId || !recruitName) {
            toast.error("Preencha o ID e Nome do Recruta.");
            setErrors({
                id: !recruitId,
                name: !recruitName
            });
            return;
        }

        const isLN = observation.trim().toUpperCase().startsWith("LN");

        // Se for LN, ignora verificação de perguntas respondidas
        if (!isLN) {
            const allAnswered = questions.every(q => q.score !== null);
            if (!allAnswered) {
                toast.error("Responda todas as perguntas.");
                return;
            }
        }

        setIsSubmitting(true);

        // --- DUPLICATE CHECK ---
        try {
            let hasError = false;
            const newErrors = { id: false, name: false };

            const { data: idCheck } = await supabase
                .from('recruitment_results')
                .select('id')
                .eq('recruit_id', recruitId)
                .limit(1);

            if (idCheck && idCheck.length > 0) {
                toast.error("ID já foi utilizado.");
                newErrors.id = true;
                hasError = true;
            }

            const { data: nameCheck } = await supabase
                .from('recruitment_results')
                .select('id')
                .eq('recruit_name', recruitName)
                .limit(1);

            if (nameCheck && nameCheck.length > 0) {
                toast.error("Nome já utilizado.");
                newErrors.name = true;
                hasError = true;
            }

            if (hasError) {
                setErrors(newErrors);
                setIsSubmitting(false);
                return; // Stop here, form data remains intact
            }

        } catch (err) {
            console.error("Error checking duplicates:", err);
            toast.error("Erro ao verificar duplicidade.");
            setIsSubmitting(false);
            return;
        }
        // -----------------------

        // Prepare Data for LN or Normal
        let finalStatus = isApto ? "APTO" : "INAPTO";
        let finalScore = totalScore;
        let finalObservation = observation;

        if (isLN) {
            finalStatus = "LN";
            finalScore = 0;
            // Remove "LN" prefix (case insensitive) and trim
            finalObservation = observation.replace(/^LN\s*/i, "").trim();
        }

        const now = new Date();
        const dataFormatada = now.toLocaleDateString("pt-BR");

        try {
            // 2. Send Webhook
            // LN uses INAPTO webhook (or could be a new one, but user implied standard flow)
            const webhookUrl = (isApto && !isLN)
                ? WEBHOOK_CONFIG.RECRUTAMENTO_APTO
                : (isLN ? WEBHOOK_CONFIG.RECRUTAMENTO_LN : WEBHOOK_CONFIG.RECRUTAMENTO_INAPTO);

            // Color: Green for APTO, Red for INAPTO, maybe Black (0x000000) for LN? Or Red.
            // Discord doesn't support 0x000000 nicely (it's transparent sometimes), use generic Dark.
            const color = (isApto && !isLN) ? 0x00FF00 : (isLN ? 0x000001 : 0xFF0000);

            let description = "";
            let title = "";

            if (finalStatus === "APTO") {
                title = "✅ Aprovação em Recrutamento Policial";
                description = `O conscrito **${recruitName}** (ID: ${recruitId}) foi considerado **APTO** e aprovado no processo de recrutamento, tendo atendido aos requisitos físicos, técnicos e disciplinares.\n\nAutorizado a prosseguir para a formação a partir de **${dataFormatada}**.`;
            } else if (finalStatus === "LN") {
                title = "Inclusão em Lista Restritiva";
                description = `O conscrito **${recruitName}** ID **${recruitId}** foi incluído na Lista Negra da Corporação em razão de conduta incompatível com os princípios de disciplina, hierarquia e ética exigidos durante o processo de recrutamento. Em decorrência desta decisão, o referido encontra-se impedido de participar de novos processos seletivos, cursos ou atividades institucionais, pelo período determinado pelo Comando, conforme regulamentação vigente.`;
            } else {
                title = "🚫 Reprovação do Recrutamento Policial";
                description = `O candidato **${recruitName}** (ID: ${recruitId}) foi considerado **INAPTO** no processo de recrutamento policial, por não atender aos critérios estabelecidos.\n\nImpedido de prosseguir para as fases subsequentes.`;
            }

            if (finalObservation && finalObservation !== "") {
                description += `\n\n**Observação:** ${finalObservation}`;
            }

            // Send Webhook with wait=true to get message ID
            const discordResponse = await fetch(`${webhookUrl}?wait=true`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embeds: [{
                        title: title,
                        description: description,
                        color: color,
                        footer: { text: `Avaliado por: ${user.username}` },
                        timestamp: now.toISOString()
                    }]
                })
            });

            let messageId = null;
            if (discordResponse.ok) {
                const discordData = await discordResponse.json();
                messageId = discordData.id;
            }

            // 1. Save to Supabase (Updated with message_id)
            const { error } = await supabase.from('recruitment_results').insert({
                recruit_id: recruitId,
                recruit_name: recruitName,
                instructor_id: user.username,
                instructor_name: user.username,
                score: finalScore,
                status: finalStatus,
                observation: finalObservation,
                created_at: now.toISOString(),
                message_id: messageId // New field for deletion logic
            });

            if (error) throw error;

            toast.success(isLN ? "Candidato enviado para Lista Negra!" : "Avaliação enviada com sucesso!");

            // Reset Form (Only on success)
            setRecruitId("");
            setRecruitName("");
            setObservation("");
            fetchQuestions();

        } catch (error) {
            console.error(error);
            toast.error("Erro ao enviar avaliação.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-12">
            <Header />
            <div className="container mx-auto px-4 pt-24 max-w-4xl">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Avaliação de Recrutamento</h1>
                        <p className="text-muted-foreground">Preencha os dados e avalie o candidato.</p>
                    </div>
                    <div className="text-right bg-secondary/30 p-4 rounded-xl border border-primary/20">
                        <span className="text-sm text-muted-foreground uppercase tracking-widest">Nota Atual</span>
                        <div className={`text-4xl font-bold ${isApto ? 'text-green-500' : 'text-red-500'}`}>
                            {totalScore.toFixed(1)}
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${isApto ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {totalScore >= 6.5 ? "APTO (≥ 6.5)" : "INAPTO (< 6.5)"}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Passaporte (ID)</label>
                        <Input
                            value={recruitId}
                            onChange={(e) => {
                                setRecruitId(e.target.value);
                                if (errors.id) setErrors(prev => ({ ...prev, id: false }));
                            }}
                            placeholder="Ex: 12345"
                            className={`bg-secondary/50 ${errors.id ? "border-red-500 ring-1 ring-red-500" : ""}`}
                        />
                        {errors.id && <span className="text-xs text-red-500">ID já utilizado ou inválido</span>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nome do Recruta</label>
                        <Input
                            value={recruitName}
                            onChange={(e) => {
                                setRecruitName(e.target.value);
                                if (errors.name) setErrors(prev => ({ ...prev, name: false }));
                            }}
                            placeholder="Ex: John Doe"
                            className={`bg-secondary/50 ${errors.name ? "border-red-500 ring-1 ring-red-500" : ""}`}
                        />
                        {errors.name && <span className="text-xs text-red-500">Nome já utilizado ou inválido</span>}
                    </div>
                </div>

                <div className="space-y-6">
                    {questions.map((q) => (
                        <Card key={q.id} className="border-l-4 border-l-primary/50 overflow-hidden">
                            <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded text-sm min-w-[2rem] text-center">
                                        {q.id}
                                    </span>
                                    <p className="font-medium text-lg leading-tight">{q.text}</p>
                                </div>

                                <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-lg self-end md:self-center">
                                    {[1.0, 0.5, 0.0].map((scoreValue) => (
                                        <button
                                            key={scoreValue}
                                            onClick={() => handleScoreChange(q.id, scoreValue)}
                                            className={`
                                                relative px-4 py-2 rounded-md font-bold text-sm transition-all
                                                ${q.score === scoreValue
                                                    ? (scoreValue === 1.0 ? 'bg-green-500 text-white shadow-lg scale-105' :
                                                        scoreValue === 0.5 ? 'bg-yellow-500 text-black shadow-lg scale-105' :
                                                            'bg-red-500 text-white shadow-lg scale-105')
                                                    : 'bg-background hover:bg-secondary text-muted-foreground'}
                                            `}
                                        >
                                            {scoreValue.toFixed(1)}
                                            {q.score === scoreValue && (
                                                <motion.div
                                                    layoutId={`check-${q.id}`}
                                                    className="absolute inset-0 border-2 border-white/20 rounded-md"
                                                />
                                            )}
                                        </button>
                                    ))}
                                    <div className="w-16 text-center font-mono font-bold text-lg border-l border-border ml-2 pl-2">
                                        {q.score !== null ? q.score.toFixed(1) : "-.-"}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-8 space-y-4">
                    <label className="text-sm font-medium">Observações Finais</label>
                    <Textarea
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        placeholder="Comentários sobre o desempenho..."
                        className="bg-secondary/50 min-h-[100px]"
                    />
                </div>

                <div className="mt-8 flex justify-end">
                    <Button
                        size="lg"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`
                            px-8 text-lg font-bold shadow-xl transition-all
                            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                            ${isApto ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}
                        `}
                    >
                        {isSubmitting ? "Enviando..." : (
                            <>
                                <Send className="w-5 h-5 mr-2" />
                                Finalizar Avaliação ({status})
                            </>
                        )}
                    </Button>
                </div>

            </div>
        </div>
    );
}
