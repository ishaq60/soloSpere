import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import router from "./Routes/Routes";
import AuthProvider from "./Provider/AuthProvider";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
<<<<<<< HEAD
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client instance
// const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
  z
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>

=======
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
    
      <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
      </QueryClientProvider>
      <Toaster></Toaster>
    </AuthProvider>
>>>>>>> 679519e (Paggenatation and filter are Done)
  </StrictMode>
);
