import Header from "@/components/layout/header"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="container mx-auto py-4">
                {children}
            </main>
        </>
    )
}
