import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import InicioPage from "./pages/InicioPage";
import EnrollmentPage from "./pages/EnrollmentPage";
import RecruitmentTestPage from "./pages/RecruitmentTestPage";
import RecruitmentResultsPage from "./pages/RecruitmentResultsPage";
import ManualPage from "./pages/ManualPage";
import RecruitmentQuestionsPage from "./pages/RecruitmentQuestionsPage";
import { AuthProvider } from "@/contexts/AuthContext";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={InicioPage} />
      <Route path={"/inscricoes"} component={EnrollmentPage} />

      <Route path={"/cursos"} component={Home} />

      {/* Sistema de Recrutamento */}
      <Route path={"/recrutamento/prova"} component={RecruitmentTestPage} />
      <Route path={"/recrutamento/resultados"} component={RecruitmentResultsPage} />
      <Route path={"/recrutamento/perguntas"} component={RecruitmentQuestionsPage} />
      <Route path="/manual/:manualId" component={ManualPage} />

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      // switchable
      >
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Router />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
