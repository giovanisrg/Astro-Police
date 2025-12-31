import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { Search, Loader2, Trash } from "lucide-react"; // Import Trash
import { useAuth } from "@/contexts/AuthContext";      // Import Auth
import { ROLE_CONFIG } from "@/config/roles";          // Import Roles
import { WEBHOOK_CONFIG } from "@/config/webhooks";    // Import Webhooks
import { toast } from "sonner";                        // Import Toast
import { Button } from "@/components/ui/button";       // Import Button

interface RecruitmentResult {
    id: string;
    recruit_id: string;
    recruit_name: string;
    instructor_name: string;
    score: number;
    status: 'APTO' | 'INAPTO' | 'LN';
    created_at: string;
    message_id?: string;
}

export default function RecruitmentResultsPage() {
    const { user } = useAuth(); // Get user
    const [results, setResults] = useState<RecruitmentResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [textFilter, setTextFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("TODOS");

    // Check if user is Admin (Instrutor Geral)
    const hasAccess = user?.discordRoles
        ? ROLE_CONFIG.INSTRUTORES.GERAL.ids.some(id => user.discordRoles.includes(id))
        : false;

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('recruitment_results')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setResults(data);
        }
        setIsLoading(false);
    };

    const handleDelete = async (result: RecruitmentResult) => {
        if (!confirm(`Tem certeza que deseja apagar o registro de ${result.recruit_name}? Isso também tentará apagar a mensagem no Discord.`)) {
            return;
        }

        try {
            // 1. Delete from Discord (if message_id exists)
            if (result.message_id) {
                let webhookUrl = "";
                if (result.status === "APTO") webhookUrl = WEBHOOK_CONFIG.RECRUTAMENTO_APTO;
                else if (result.status === "LN") webhookUrl = WEBHOOK_CONFIG.RECRUTAMENTO_LN;
                else webhookUrl = WEBHOOK_CONFIG.RECRUTAMENTO_INAPTO;

                if (webhookUrl && webhookUrl !== "") {
                    // Webhook Delete URL: webhook_url/messages/message_id
                    await fetch(`${webhookUrl}/messages/${result.message_id}`, {
                        method: 'DELETE',
                    });
                }
            }

            // 2. Delete from Supabase
            const { error } = await supabase
                .from('recruitment_results')
                .delete()
                .eq('id', result.id);

            if (error) throw error;

            toast.success("Registro removido com sucesso!");

            // Update UI immediately (Optimistic removal)
            setResults(prev => prev.filter(r => r.id !== result.id));

            // fetchResults(); // No strictly needed if we update status locally, but can keep as backup if desired. 
            // Better to just rely on local state to avoid flicker.

        } catch (error) {
            console.error("Erro ao deletar:", error);
            toast.error("Erro ao deletar registro.");
        }
    };

    const filteredResults = results.filter(r => {
        const matchesText =
            r.recruit_name.toLowerCase().includes(textFilter.toLowerCase()) ||
            r.recruit_id.includes(textFilter);

        const matchesStatus = statusFilter === "TODOS" || r.status === statusFilter;

        return matchesText && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-background pb-12">
            <Header />
            <div className="container mx-auto px-4 pt-24">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Resultados de Recrutamento</h1>
                        <p className="text-muted-foreground">Histórico de avaliações realizadas.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Buscar por Nome ou ID..."
                            value={textFilter}
                            onChange={(e) => setTextFilter(e.target.value)}
                            className="pl-10 bg-secondary/50"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-secondary/50">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="TODOS">Todos</SelectItem>
                            <SelectItem value="APTO">Apto</SelectItem>
                            <SelectItem value="INAPTO">Inapto</SelectItem>
                            <SelectItem value="LN">Lista Negra (LN)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card className="border-primary/20 bg-card/50 backdrop-blur">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-primary/20">
                                    <TableHead>Data</TableHead>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Instrutor</TableHead>
                                    <TableHead className="text-center">Nota</TableHead>
                                    <TableHead className="text-right">Resultado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredResults.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                            Nenhum resultado encontrado.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredResults.map((result) => (
                                        <TableRow key={result.id} className="border-primary/10 hover:bg-primary/5">
                                            <TableCell className="font-mono text-xs">
                                                {new Date(result.created_at).toLocaleDateString('pt-BR')} <br />
                                                <span className="text-muted-foreground">{new Date(result.created_at).toLocaleTimeString('pt-BR')}</span>
                                            </TableCell>
                                            <TableCell className="font-mono">{result.recruit_id}</TableCell>
                                            <TableCell className="font-medium text-foreground">{result.recruit_name}</TableCell>
                                            <TableCell className="text-muted-foreground">{result.instructor_name}</TableCell>
                                            <TableCell className="text-center font-bold">
                                                {typeof result.score === 'number' ? result.score.toFixed(1) : result.score}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${result.status === 'APTO' ? 'bg-green-500/20 text-green-500' :
                                                        result.status === 'LN' ? 'bg-black text-white border border-white/20' :
                                                            'bg-red-500/20 text-red-500'
                                                        }`}>
                                                        {result.status === 'LN' ? 'LISTA NEGRA' : result.status}
                                                    </span>

                                                    {/* Delete Button for Admins */}
                                                    {hasAccess && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-muted-foreground hover:text-red-500"
                                                            onClick={() => handleDelete(result)}
                                                            title="Apagar Registro e Mensagem do Discord"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
