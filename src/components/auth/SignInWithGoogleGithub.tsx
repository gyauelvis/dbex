import { signIn } from "@/auth"
import {
    Github01Icon,
} from "hugeicons-react"

import { GoogleIcon } from "@/components/icons/GoogleIcon"
import { Button } from "@/components/ui/button" 

export function SignInWithGoogle() {
    return (
        <Button onClick={() => signIn('google')} className="w-full dark:bg-secondary dark:hover:bg-secondary-foreground dark:text-secondary-foreground dark:hover:text-secondary">
            <GoogleIcon size="28"></GoogleIcon>
        </Button>
    )
}

export function SignInWithGithub() {
    return (
        <Button onClick={() => signIn('github')} className="w-full dark:bg-secondary dark:hover:bg-secondary-foreground dark:text-secondary-foreground dark:hover:text-secondary">
            <Github01Icon size={28} className=""></Github01Icon>
        </Button>
    )
}