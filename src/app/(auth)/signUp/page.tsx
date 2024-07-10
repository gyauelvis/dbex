"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link";

import {
    Mail01Icon as Mail,
    SquareLock02Icon as Lock
} from "hugeicons-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignInWithGithub, SignInWithGoogle } from "@/components/auth/SignInWithGoogleGithub";
import { registerUser } from "@/registerUser"

const signInFormSchema = z.object({
    email: z.string().email({
        message: "Invalid email address"
    }),
    password: z.string().min(8).refine((data) => data.match(/[a-z]/) && data.match(/[A-Z]/) && data.match(/[0-9]/) && data.match((/^(?=.*[\W_]).*$/)), {
        message: "Password must contain at least one uppercase letter, one lowercase letter, one special character and one number.",
        path: ["password"],
    }),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type signInFormSchema = z.infer<typeof signInFormSchema>

export default function SignUpPage() {

    const form = useForm<z.infer<typeof signInFormSchema>>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
    })

    const onSubmit = async(values: z.infer<typeof signInFormSchema>) => {
        const registerNewUser = await registerUser(values.email, values.password);
        console.log(registerNewUser)
    }
    return (
        <div className="flex flex-row justify-center items-center min-h-screen font-sans">
            <div className="form-wrapper w-96 rounded-lg border p-3 shadow-2xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-col justify-center items-center gap-2">
                            <h1 className="text-3xl font-bold">Create Account</h1>
                            <div className="text-sm"> <span className="text-muted-foreground">Already have an account? </span><Link href="/signIn" className="underline">Sign In</Link></div>
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Email</FormLabel>
                                    <FormControl>
                                        <div className="input-icon flex flex-row relative">
                                            <Mail className="absolute flex flex-row top-1/2 -translate-y-1/2 mx-1.5 stroke-slate-400 size-4 text-muted-foreground"></Mail>
                                            <Input type="mail" placeholder="Enter email"{...field} className="placeholder-shown:px-6 px-6 text-muted-foreground" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Password</FormLabel>
                                    <FormControl>
                                        <div className="input-icon flex flex-row relative">
                                            <Lock className="absolute flex flex-row top-1/2 -translate-y-1/2 mx-1.5 stroke-slate-400 size-4 text-muted-foreground"></Lock>
                                            <Input type="password" placeholder="Enter password"{...field} className="placeholder-shown:px-6 px-6 text-muted-foreground" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="input-icon flex flex-row relative">
                                            <Lock className="absolute flex flex-row top-1/2 -translate-y-1/2 mx-1.5 stroke-slate-400 size-4 text-muted-foreground"></Lock>
                                            <Input type="password" placeholder="Retype password"{...field} className="placeholder-shown:px-6 px-6 text-muted-foreground" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full dark:bg-secondary dark:hover:bg-secondary-foreground dark:text-secondary-foreground dark:hover:text-secondary">Submit</Button>
                        <div className="flex flex-row justify-center items-center">
                            <span className="text-sm capitalize">Or Continue With</span>
                        </div>
                        <div className="flex gap-5">
                            <SignInWithGoogle/>
                            <SignInWithGithub/>
                        </div>
                    </form>
                </Form>
            </div>

        </div>

    )
}
