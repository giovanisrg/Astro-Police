/* Design Philosophy: Sci-Fi Corporativo Espacial
 * - Glassmorphism cards flutuantes
 * - Profundidade z-axis através de backdrop blur
 * - Animações suaves (cubic-bezier(0.4, 0.0, 0.2, 1))
 * - Tipografia: Orbitron (display), Inter (body)
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, GraduationCap, Shield, TrendingUp, Award, ChevronRight, X, Edit, Trash2, Plus, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { EnrollmentModal } from "@/components/EnrollmentModal";
import { CourseEditorModal } from "@/components/CourseEditorModal";
import {
  Curso,
  INITIAL_CURSOS_OBRIGATORIOS, INITIAL_CURSOS_GUARNICAO
} from "@/data/initialData";
import { ROLE_CONFIG } from "@/config/roles";
import { toast } from "sonner";

// ... existing code ...


// Dados movidos para @/data/initialData.ts





const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};

interface CursoCardProps {
  curso: Curso;
  isEditing?: boolean;
  onEdit?: (curso: Curso) => void;
  onDelete?: (cursoId: string) => void;
}

function CursoCard({ curso, isEditing, onEdit, onDelete }: CursoCardProps) {
  const { user, canDownloadPDF } = useAuth();
  const [showEnrollment, setShowEnrollment] = useState(false);


  // Determinar estado do botão

  const canDownload = canDownloadPDF(curso.guarnicao);

  // Specific checks for detailed feedback
  // Specific checks for detailed feedback
  let isMember = false;
  let isAuthorized = false;
  let hasAccessRole = false;
  let hasAnyRank = false;

  try {
    if (user && ROLE_CONFIG && ROLE_CONFIG.PATENTES) {
      isMember = !!user.memberOfDiscord;
      const roles = user.discordRoles || [];

      hasAccessRole = roles.includes(ROLE_CONFIG.ACCESS_ROLE_ID);
      hasAnyRank = ROLE_CONFIG.PATENTES.some(p => roles.includes(p.id));
      isAuthorized = hasAccessRole || hasAnyRank;
    }
  } catch (err) {
    console.error("Erro ao verificar permissões:", err);
  }

  const hasLevel = (user?.level ?? 0) >= curso.minLevel;

  const canEnrollInCourse = isMember && isAuthorized && hasLevel;

  return (
    <>
      <motion.div variants={itemVariants} className="h-full relative group">
        {isEditing && (
          <div className="absolute top-2 right-2 flex gap-1 z-20">
            <Button size="icon" variant="secondary" className="h-8 w-8 bg-background/80 hover:bg-white text-foreground shadow-sm" onClick={(e) => { e.stopPropagation(); onEdit?.(curso); }}>
              <Edit className="w-4 h-4 text-blue-500" />
            </Button>
            <Button size="icon" variant="destructive" className="h-8 w-8 shadow-sm" onClick={(e) => { e.stopPropagation(); onDelete?.(curso.id); }}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
        <Card className={`glass glow-hover h-full flex flex-col border-primary/20 hover:border-primary/40 transition-all duration-300 ${isEditing ? 'border-dashed border-2' : ''}`}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-2">
              <CardTitle className="text-xl text-foreground leading-tight">{curso.nome}</CardTitle>
              {curso.nivel && (
                <Badge variant="outline" className="bg-accent/20 text-accent border-accent/40 shrink-0">
                  {curso.nivel}
                </Badge>
              )}
            </div>
            <CardDescription className="text-muted-foreground">
              <span className="inline-flex items-center gap-2 text-primary font-medium">
                <TrendingUp className="w-4 h-4" />
                {curso.progressao}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <p className="text-sm text-foreground/80 mb-4">{curso.descricao}</p>

            <div className="mb-4">
              <h4 className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">Módulos</h4>
              <ul className="space-y-1">
                {curso.modulos.map((modulo, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{modulo}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="w-4 h-4 text-primary" />
                <span>{curso.cargaHoraria}</span>
              </div>

              {/* Botão Dinâmico: PDF se for instrutor DO CURSO, senão Matricular-se */}
              {canDownload ? (
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground glow-hover"
                  onClick={() => window.open(curso.pdf, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              ) : (
                // Se não pode baixar (não é instrutor DESTE curso), mostra opção de matrícula
                canEnrollInCourse ? (
                  <Button
                    size="sm"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground glow-hover"
                    onClick={() => setShowEnrollment(true)}
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Matricular-se
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled
                    variant="outline"
                    className="cursor-not-allowed opacity-80"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Inapto
                  </Button>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modal de Matrícula */}
      {showEnrollment && (
        <EnrollmentModal
          curso={{ id: curso.id, nome: curso.nome, guarnicao: curso.guarnicao }}
          onClose={() => setShowEnrollment(false)}
        />
      )}
    </>
  );
}






export default function Home() {
  const { user } = useAuth();

  // Data States
  const [cursosObrigatorios, setCursosObrigatorios] = useState<Curso[]>(INITIAL_CURSOS_OBRIGATORIOS);
  const [cursosGuarnicao, setCursosGuarnicao] = useState<Curso[]>(INITIAL_CURSOS_GUARNICAO);

  // Editing States
  const [isEditing, setIsEditing] = useState(false);
  const [editorState, setEditorState] = useState<{ isOpen: boolean, curso: Curso | null, type: 'obrigatorio' | 'guarnicao' }>({
    isOpen: false,
    curso: null,
    type: 'obrigatorio'
  });



  // CRUD Handlers
  const openEditor = (curso: Curso | null, type: 'obrigatorio' | 'guarnicao') => {
    setEditorState({ isOpen: true, curso, type });
  };

  const handleSaveCourse = (savedCurso: Curso) => {
    const { type, curso: originalCurso } = editorState;

    const updateList = (list: Curso[], setList: React.Dispatch<React.SetStateAction<Curso[]>>) => {
      if (originalCurso) {
        // Edit
        setList(list.map(c => c.id === savedCurso.id ? savedCurso : c));
      } else {
        // Create
        setList([...list, savedCurso]);
      }
    };

    if (type === 'obrigatorio') updateList(cursosObrigatorios, setCursosObrigatorios);
    else updateList(cursosGuarnicao, setCursosGuarnicao);

    setEditorState(prev => ({ ...prev, isOpen: false }));
  };

  const handleDeleteCourse = (id: string, type: 'obrigatorio' | 'guarnicao') => {
    if (confirm("Tem certeza que deseja remover este curso?")) {
      if (type === 'obrigatorio') setCursosObrigatorios(prev => prev.filter(c => c.id !== id));
      else setCursosGuarnicao(prev => prev.filter(c => c.id !== id));
      toast.success("Curso removido com sucesso.");
    }
  };

  // Filter logic


  return (
    <div className="min-h-screen pt-16">
      <Header />

      {/* Edit Mode Toggle for General Instructor */}
      {user?.instructorType === 'geral' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-24 right-6 z-40"
        >
          <Button
            variant={isEditing ? "destructive" : "secondary"}
            onClick={() => setIsEditing(!isEditing)}
            className="shadow-lg border border-primary/20 backdrop-blur-md"
          >
            {isEditing ? (
              <><X className="w-4 h-4 mr-2" /> Sair da Edição</>
            ) : (
              <><Edit className="w-4 h-4 mr-2" /> Modo Edição</>
            )}
          </Button>
        </motion.div>
      )}

      <AnimatePresence>
        {editorState.isOpen && (
          <CourseEditorModal
            cursoToEdit={editorState.curso}
            defaultGuarnicao={editorState.type === 'guarnicao' ? 'GRA' : undefined}
            onClose={() => setEditorState(prev => ({ ...prev, isOpen: false }))}
            onSave={handleSaveCourse}
          />
        )}
      </AnimatePresence>



      {/* Cursos Section */}
      <section className="container mx-auto px-4 pb-20">
        <Tabs defaultValue="obrigatorios" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="bg-secondary/50 backdrop-blur p-1 rounded-full border border-primary/20">
              <TabsTrigger value="obrigatorios" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Obrigatórios
              </TabsTrigger>
              <TabsTrigger value="guarnicao" className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Por Guarnição
              </TabsTrigger>
            </TabsList>
          </div>


          <TabsContent value="obrigatorios">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {cursosObrigatorios.map((curso) => (
                  <CursoCard
                    key={curso.id}
                    curso={curso}
                    isEditing={isEditing}
                    onEdit={(c) => openEditor(c, 'obrigatorio')}
                    onDelete={(id) => handleDeleteCourse(id, 'obrigatorio')}
                  />
                ))}
                {/* Botão de Adicionar Curso para Instrutor Geral quando editando */}
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full min-h-[300px] flex items-center justify-center border-2 border-dashed border-primary/30 rounded-xl cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all group"
                    onClick={() => openEditor(null, 'obrigatorio')}
                  >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary">
                      <Plus className="w-12 h-12" />
                      <span className="font-medium">Adicionar Curso</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          <TabsContent value="guarnicao">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {cursosGuarnicao.map((curso) => (
                  <CursoCard
                    key={curso.id}
                    curso={curso}
                    isEditing={isEditing}
                    onEdit={(c) => openEditor(c, 'guarnicao')}
                    onDelete={(id) => handleDeleteCourse(id, 'guarnicao')}
                  />
                ))}
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full min-h-[300px] flex items-center justify-center border-2 border-dashed border-primary/30 rounded-xl cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all group"
                    onClick={() => openEditor(null, 'guarnicao')}
                  >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary">
                      <Plus className="w-12 h-12" />
                      <span className="font-medium">Adicionar Curso</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </TabsContent>


        </Tabs>
      </section>

      {/* Footer ... */}
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


