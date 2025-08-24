import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EditorPageSimple from "./pages/EditorPageSimple";
import EditorPage from "./pages/EditorPage";   // ✅ Added full editor
import DocsPlaceholder from "./pages/DocsPlaceholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Simple editor (current Get Started points here) */}
            <Route
              path="/editor"
              element={
                <Layout>
                  <EditorPageSimple />
                </Layout>
              }
            />

            {/* ✅ Added full-featured editor */}
            <Route
              path="/editor-full"
              element={
                <Layout>
                  <EditorPage />
                </Layout>
              }
            />

            <Route
              path="/docs/*"
              element={
                <Layout>
                  <DocsPlaceholder />
                </Layout>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
