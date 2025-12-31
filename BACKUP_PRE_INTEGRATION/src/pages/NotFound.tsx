import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                404
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">Página não encontrada</p>

            <div className="mt-8">
                <Link href="/">
                    <Button variant="outline">Voltar para Início</Button>
                </Link>
            </div>
        </div>
    );
}
