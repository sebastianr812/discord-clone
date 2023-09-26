import NavigationSidebar from "@/components/navigation/NavigationSidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
            <div className="h-full">
            <div className="hidden md:flex h-full w-[72px] z-30 flex-col inset-y-0 fixed">
            <NavigationSidebar />
            </div>
            <main className="md:pl-[72px] h-full ">
            {children}
            </main>
            </div>
           );
}

export default MainLayout;
