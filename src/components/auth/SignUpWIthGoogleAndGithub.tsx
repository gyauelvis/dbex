import {
    GithubIcon,
    GoogleIcon
} from "@/components/icons"

import { Button } from "@/components/ui/button"
import { createClient } from "../../../utils/supabase/client";

export function SignInWithGoogle() {
    return (
        <Button onClick={async (event) => {
            event.preventDefault();
        }}
            className="w-full rounded-lg dark:bg-secondary dark:hover:bg-secondary-foreground dark:text-secondary-foreground dark:hover:text-secondary">
            <GoogleIcon size="24"></GoogleIcon>
        </Button>
    )
}

export function SignInWithGithub() {
    const signInWithGithub = async () => {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: `app/home`,
            },
        })
    }
    return (
        <Button onClick={async (event) => {
            event.preventDefault();
            signInWithGithub();
        }} className="w-full dark:bg-secondary rounded-lg dark:hover:bg-secondary-foreground dark:text-secondary-foreground dark:hover:text-secondary">
            <GithubIcon className="size-5"></GithubIcon>
        </Button>
    )
}