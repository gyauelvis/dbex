import { auth } from "@/auth";
import { cookies } from "next/headers"
import { SignIn } from "@/components/auth/server";
import MainNav from "@/components/layout/main-nav";
import AppLayout from "@/components/layout/app-layout";
import { ResizableHandle } from "@/components/ui/resizable";
import { createClient } from "../../../utils/supabase/server";


export default async function Home({
  children,
}: {
  children: React.ReactNode;
}) {

  const layout = cookies().get("react-resizable-panels:layout")
  const collapsed = cookies().get("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout.value) : [15, 25, 65]
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : false

  const session = await auth()
  const supabase = createClient()

  const authData = await supabase.auth.getUser()


   if ( !session && !authData) {
    return (
       <div className='grid size-full h-screen place-items-center gap-4'>
        <div className="gap-2 grid grid-flow-row h-fit">
          <p>You are not authorized to access this page</p>
          <SignIn />
         </div>
       </div>
     )
   } else {
    return (
      <main className="h-screen size-full">
        <AppLayout>
        <MainNav
          defaultCollapsed={defaultCollapsed}
          defaultSize={defaultLayout[0]}
        />
        <ResizableHandle className='bg-transparent' />
          {children}
        </AppLayout>
      </main>
    );
  }
}
