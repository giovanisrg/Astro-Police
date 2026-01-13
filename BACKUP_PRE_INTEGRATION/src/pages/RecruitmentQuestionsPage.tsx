import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Edit, Plus, Trash, Save, X } from "lucide-react";
import { ROLE_CONFIG } from "@/config/roles";

interface Question {
    id: number;
    text: string;
    active: boolean;
}

export default function RecruitmentQuestionsPage() {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [newQuestionText, setNewQuestionText] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState("");

    // Verify access: APENAS Admin (Instrutor Geral) pode gerenciar perguntas
    const hasAccess = ROLE_CONFIG.INSTRUTORES.GERAL.ids.some(id => user?.discordRoles.includes(id));

    useEffect(() => {
        if (hasAccess) {
            fetchQuestions();

            const channel = supabase.channel('questions_realtime')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'recruitment_questions' }, () => {
                    toast.info("Perguntas atualizadas!");
                    fetchQuestions();
                })
                .subscribe();

            return () => { supabase.removeChannel(channel); };
        }
    }, [user, hasAccess]);

    const fetchQuestions = async () => {
        // setIsLoading(true);
        const { data, error } = await supabase
            .from('recruitment_questions')
            .select('*')
            .order('id', { ascending: true });

        if (!error && data) {
            setQuestions(data);
        }
        // setIsLoading(false);
    };

    const handleAddQuestion = async () => {
        if (!newQuestionText.trim()) return;

        const { error } = await supabase
            .from('recruitment_questions')
            .insert({ text: newQuestionText, active: true });

        if (error) {
            toast.error("Erro ao adicionar pergunta.");
        } else {
            toast.success("Pergunta adicionada!");
            setNewQuestionText("");
            setIsDialogOpen(false);
            fetchQuestions();
        }
    };

    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        // Optimistic update
        setQuestions(questions.map(q => q.id === id ? { ...q, active: !currentStatus } : q));

        const { error } = await supabase
            .from('recruitment_questions')
            .update({ active: !currentStatus })
            .eq('id', id);

        if (error) {
            toast.error("Erro ao atualizar status.");
            fetchQuestions(); // Revert
        }
    };

    const startEditing = (q: Question) => {
        setEditingId(q.id);
        setEditText(q.text);
    };

    const saveEdit = async (id: number) => {
        const { error } = await supabase
            .from('recruitment_questions')
            .update({ text: editText })
            .eq('id', id);

        if (error) {
            toast.error("Erro ao salvar edição.");
        } else {
            toast.success("Pergunta atualizada!");
            setEditingId(null);
            fetchQuestions();
        }
    };

    const deleteQuestion = async (id: number) => {
        // Soft delete or hard delete? Let's check permissions or just use active false logic mostly.
        // But if adding CRUD, user expects delete.
        if (!window.confirm("Tem certeza que deseja excluir esta pergunta?")) return;

        const { error } = await supabase
            .from('recruitment_questions')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error("Erro ao excluir. Talvez existam avaliações vinculadas.");
        } else {
            toast.success("Pergunta excluída.");
            fetchQuestions();
        }
    };

    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold text-red-500 mb-2">Acesso Negado</h1>
                    <p className="text-muted-foreground">Você não tem permissão para gerenciar perguntas.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            <Header />
            <div className="container mx-auto px-4 pt-24 max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Gerenciar Perguntas</h1>
                        <p className="text-muted-foreground">Adicione, edite ou desative perguntas da prova.</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 font-bold">
                                <Plus className="w-4 h-4" /> Nova Pergunta
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Adicionar Nova Pergunta</DialogTitle>
                            </DialogHeader>
                            <Input
                                value={newQuestionText}
                                onChange={(e) => setNewQuestionText(e.target.value)}
                                placeholder="Digite a pergunta..."
                                className="mt-4"
                            />
                            <DialogFooter className="mt-4">
                                <Button onClick={handleAddQuestion}>Salvar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="border-primary/20 bg-card/50 backdrop-blur">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">ID</TableHead>
                                    <TableHead>Pergunta</TableHead>
                                    <TableHead className="w-[100px]">Status</TableHead>
                                    <TableHead className="text-right w-[150px]">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {questions.map((q) => (
                                    <TableRow key={q.id}>
                                        <TableCell className="font-mono text-xs">{q.id}</TableCell>
                                        <TableCell>
                                            {editingId === q.id ? (
                                                <div className="flex gap-2">
                                                    <Input
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                    />
                                                    <Button size="icon" variant="ghost" onClick={() => saveEdit(q.id)}>
                                                        <Save className="w-4 h-4 text-green-500" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                                                        <X className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className={!q.active ? "text-muted-foreground line-through" : ""}>
                                                    {q.text}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={q.active}
                                                    onCheckedChange={() => handleToggleActive(q.id, q.active)}
                                                />
                                                <span className="text-xs text-muted-foreground">
                                                    {q.active ? "Ativa" : "Inativa"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button size="icon" variant="ghost" onClick={() => startEditing(q)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" onClick={() => deleteQuestion(q.id)}>
                                                    <Trash className="w-4 h-4 text-red-500/50 hover:text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
