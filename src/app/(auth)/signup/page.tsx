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
const page = () => {
  const [username, setUsername] = useState("");
  const [isUsernameCheck, setIsUsernameCheck] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debounce = useDebounceCallback(setUsername, 300);
const router = useRouter()

  useEffect(() => {
    const checkUsernameUnique = async () => {
      try {
        if (username) {
          setIsUsernameCheck(true);
          setUsernameMessage("");
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          console.log(response?.data);

          if (response?.data?.success) {
            setUsernameMessage(response?.data?.message);
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError<Apiresponse>;
        if (axiosError) {
          setUsernameMessage(
            axiosError?.response?.data.message || "An unknown error occurred"
          );
          return;
        }
        console.error(error);
      } finally {
        setIsUsernameCheck(false);
      }
    };

    checkUsernameUnique();
  }, [username]);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const handleSignup = async (data: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/signup", data);
      console.log(response);
      if (response.data?.success) {
        toast({
          description: response.data?.message,
          className: "bg-green-500 text-white p-4 rounded-lg shadow-md",
        });
        router.replace(`/verify-otp/${data.email}`)
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
        <form onSubmit={form.handleSubmit(handleSignup)}>
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading}
                    className="p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                    onChange={(e) => {
                      field.onChange(e);
                      debounce(e.target.value);
                    }}
                  />
                </FormControl>
                {isUsernameCheck ? (
                  <p className="text-yellow-500 font-semibold mt-2">
                    Username is checking...
                  </p>
                ) : (
                  <p className="text-green-500 font-semibold mt-2">
                    {usernameMessage}
                  </p>
                )}

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold">Email</FormLabel>
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
            {isLoading ? "Submitting..." : "Sign Up"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default page;
