'use client'

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Apiresponse } from "@/types/ApiResponse";
import { useRouter} from "next/navigation";
import verifySchema from "@/schemas/verifySchema";
import { useState } from "react";
import { useParams } from "next/navigation";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
const page = () => {
  
const router = useRouter()
const params = useParams<{email: string}>()
const decodeEmail = decodeURIComponent(params.email)
const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
     otp: ''
    },
  });

  const handleVerifyOtp = async (data: z.infer<typeof verifySchema>) => {
  
    setIsLoading(true);
    try {
      const response = await axios.post("/api/verify-otp", { email: decodeEmail, otp: data.otp});
      console.log(response);
      if (response.data?.success) {
        toast({
          description: response.data?.message,
          className: "bg-green-500 text-white p-4 rounded-lg shadow-md",
        });
        router.push(`/signin`)
      }
    } catch (error) {
      const axiosError = error as AxiosError<Apiresponse>;
      if (axiosError) {
        console.log(axiosError?.response?.data?.message);
        toast({
          description: axiosError?.response?.data?.message,
          className: "bg-red-700 text-white p-4 rounded-lg shadow-md",
        });
        return;
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
     <Form {...form}>
      <form onSubmit={form.handleSubmit(handleVerifyOtp)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
 
 <Button type="submit">{isLoading ? 'verifying otp' : 'submit'}</Button>

      </form>
    </Form>
    </div>
  );
};

export default page;
