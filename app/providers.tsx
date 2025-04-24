"use client"
 
import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"
 
import { betterAuthClient } from "@/lib/integrations/better-auth"
 
export function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()
 
    return (
        <AuthUIProvider
            authClient={betterAuthClient}
            navigate={router.push}
            replace={router.replace}
            onSessionChange={() => {
                // Clear router cache (protected routes)
                router.refresh()
            }}
            Link={Link}
        >
            {children}
        </AuthUIProvider>
    )
}