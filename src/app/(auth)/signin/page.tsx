"use client";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import signUpSchema from "@/schemas/signUpSchema";
import { toast } from "@/hooks/use-toast";
import { Apiresponse } from "@/types/ApiResponse";
import { useRouter } from "next/navigation";
import signInSchema from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handleSignIn = async (data: z.infer<typeof signInSchema>) => {


    const response = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if(response?.ok && !response.error){
      router.push('/')
    }else{
      toast({
    className: "bg-green-500 text-white p-4 rounded-lg shadow-md",
        description: response?.error || 'Login failed'
      })
    }
    console.log("response : ", response);
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignIn)}>
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Username/Email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading}
                    className="p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                    placeholder="Username/Email "
                  />
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
                <FormLabel className="text-lg font-semibold">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading}
            type="submit"
            className="px-6 py-3 mt-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 focus:ring focus:ring-indigo-300"
          >
            {isLoading ? "Submitting..." : "Sign in"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default page;
