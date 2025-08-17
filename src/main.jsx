import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./contexts/AuthProvider.jsx";
import { router } from "./router/router.jsx";
AOS.init();
// Create a client
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-urbanist max-w-7xl mx-auto">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </div>
  </StrictMode>
);
