import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Shield, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { BannerData, INITIAL_BANNER_DATA } from "@/data/initialData";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function InicioPage() {
    const [, setLocation] = useLocation();
    const { user } = useAuth();

    // State initialized with safe defaults, will be populated by DB
    const [bannerData, setBannerData] = useState<BannerData>({
        status: 'aberto',
        titulo: 'CARREGANDO...',
        subtitulo: 'Aguarde um momento...',
        gifUrl: ''
    });

    const [isEditingBanner, setIsEditingBanner] = useState(false);

    // --- SUPABASE SYNC LOGIC ---
    useEffect(() => {
        // 1. Fetch Initial Data
        const fetchBanner = async () => {
            const { data } = await supabase
                .from('banner_settings')
                .select('*')
                .single();

            if (data) {
                setBannerData({
                    status: data.status as 'aberto' | 'fechado',
                    titulo: data.titulo,
                    subtitulo: data.subtitulo,
                    gifUrl: data.image_url
                });
            }
        };

        fetchBanner();

        // 2. Subscribe to Realtime Changes
        const subscription = supabase
            .channel('banner_realtime')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'banner_settings' }, (payload) => {
                const newData = payload.new;
                toast.info("Status de Inscrições Atualizado!");
                setBannerData({
                    status: newData.status,
                    titulo: newData.titulo,
                    subtitulo: newData.subtitulo,
                    gifUrl: newData.image_url
                });
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // 3. Save Function
    const handleSave = async (newData: BannerData) => {
        // Optimistic UI Update
        setBannerData(newData);
        setIsEditingBanner(false);

        try {
            const { error } = await supabase
                .from('banner_settings')
                .update({
                    status: newData.status,
                    titulo: newData.titulo,
                    subtitulo: newData.subtitulo,
                    image_url: newData.gifUrl,
                    updated_at: new Date().toISOString()
                })
                .eq('id', 1);

            if (error) throw error;
            toast.success("Banner atualizado globalmente!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar no banco de dados.");
        }
    };

    return (
        <div className="min-h-screen pt-16">
            <Header enrollmentStatus={bannerData.status} />

            {/* Banner Hero Editável */}
            <section className="relative px-4 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="container relative z-10 py-8"
                >
                    {/* Seção Institucional - Propósitos */}
                    <div className="max-w-4xl mx-auto text-center space-y-8 mb-12">
                        <div className="inline-flex items-center gap-3">
                            <Shield className="w-16 h-16 text-primary glow" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                            Nossa Missão em AstroRP
                        </h2>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
                            A Astro Police é a força de segurança primordial da cidade, dedicada a manter a ordem, proteger os cidadãos e garantir que a justiça prevaleça nos confins do universo. Com tecnologia de ponta e treinamento rigoroso, nossos oficiais são o escudo entre a civilização e o caos.
                        </p>
                    </div>

                    {/* Banner Chamativo */}
                    <div
                        className={`relative mt-20 overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/20 via-background to-background shadow-[0_0_50px_rgba(0,217,255,0.3)] transition-all duration-300 ${bannerData.status === 'aberto' ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default opacity-80'
                            }`}
                        onClick={() => {
                            if (bannerData.status === 'aberto') {
                                setLocation('/inscricoes');
                                toast.success('Redirecionando para área de recrutamento...');
                            }
                        }}
                    >
                        {/* Background GIF/Image */}
                        {bannerData.gifUrl && (
                            <div className="absolute inset-0 opacity-30">
                                <img src={bannerData.gifUrl} alt="Banner background" className="w-full h-full object-cover" />
                            </div>
                        )}

                        {/* Efeitos visuais */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />

                        <div className="relative z-10 p-12 md:p-20 text-center space-y-6">
                            {user?.instructorType === 'geral' && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="absolute top-4 right-4 border-primary/50 bg-background/80 backdrop-blur"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isEditingBanner) {
                                            handleSave(bannerData); // Salvar ao clicar no botão
                                        } else {
                                            setIsEditingBanner(true);
                                        }
                                    }}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    {isEditingBanner ? 'Salvar Alterações' : 'Editar Banner'}
                                </Button>
                            )}

                            {isEditingBanner ? (
                                <div
                                    className="max-w-2xl mx-auto space-y-4 bg-background/95 p-6 rounded-lg backdrop-blur border border-primary/20"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Status</label>
                                        <select
                                            value={bannerData.status}
                                            onChange={(e) => {
                                                const newStatus = e.target.value as 'aberto' | 'fechado';
                                                let newData = { ...bannerData, status: newStatus };

                                                if (newStatus === 'fechado') {
                                                    newData = {
                                                        ...newData,
                                                        titulo: "INSCRIÇÕES ENCERRADAS",
                                                        subtitulo: "Não há vagas disponíveis no momento. Novas inscrições serão divulgadas por meio dos canais oficiais do discord AstroRP. https://discord.gg/AstroRP"
                                                    };
                                                } else {
                                                    newData = {
                                                        ...newData,
                                                        titulo: "RECRUTAMENTO ABERTO",
                                                        subtitulo: "Junte-se à elite da segurança espacial."
                                                    };
                                                }

                                                setBannerData(newData);
                                            }}
                                            className="w-full p-2 bg-secondary border border-primary/30 rounded"
                                        >
                                            <option value="aberto">Inscrições Abertas</option>
                                            <option value="fechado">Inscrições Fechadas</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Título</label>
                                        <Input
                                            value={bannerData.titulo}
                                            onChange={(e) => setBannerData({ ...bannerData, titulo: e.target.value })}
                                            className="bg-secondary border-primary/30 text-center text-2xl font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">Subtítulo</label>
                                        <Textarea
                                            value={bannerData.subtitulo}
                                            onChange={(e) => setBannerData({ ...bannerData, subtitulo: e.target.value })}
                                            className="bg-secondary border-primary/30 text-center"
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-muted-foreground mb-2 block">URL do GIF/Imagem</label>
                                        <Input
                                            value={bannerData.gifUrl || ''}
                                            onChange={(e) => setBannerData({ ...bannerData, gifUrl: e.target.value })}
                                            className="bg-secondary border-primary/30"
                                            placeholder="https://exemplo.com/banner.gif"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className={`inline-block px-8 py-3 rounded-full text-base font-bold animate-pulse ${bannerData.status === 'aberto'
                                        ? 'bg-primary/30 text-primary border-2 border-primary shadow-[0_0_20px_rgba(0,217,255,0.5)]'
                                        : 'bg-destructive/30 text-destructive border-2 border-destructive shadow-[0_0_20px_rgba(255,0,0,0.5)]'
                                        }`}>
                                        {bannerData.status === 'aberto' ? '🟢 INSCRIÇÕES ABERTAS' : '🔴 INSCRIÇÕES FECHADAS'}
                                    </div>
                                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground drop-shadow-[0_0_30px_rgba(0,217,255,0.5)] animate-in">
                                        {bannerData.titulo}
                                    </h1>
                                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                                        {bannerData.subtitulo.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                                            part.match(/(https?:\/\/[^\s]+)/g)
                                                ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium relative z-20" onClick={(e) => e.stopPropagation()}>{part}</a>
                                                : part
                                        )}
                                    </p>
                                    {/* Adicionei z-20 e onClick stopPropagation no link para garantir clicabilidade mesmo se o banner pai tiver onClick (que agora tem para navegação) */}
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 border-t border-border/50 mt-20">
                <div className="container">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Shield className="w-8 h-8 text-primary" />
                            <span className="text-xl font-bold text-foreground">ASTRO POLICE</span>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                            Sistema de Cursos de Formação - Todos os direitos reservados
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
