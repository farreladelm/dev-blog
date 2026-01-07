import Header from "@/components/header"

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main className="container mx-auto p-4">
                {children}
            </main>
        </>
    )
}
