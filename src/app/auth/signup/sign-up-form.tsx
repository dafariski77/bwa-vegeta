"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hover } from "@/lib/hover";
import { cn } from "@/lib/utils";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { authApi } from "@/services/auth";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

type UserAuthForm = {
  email: string;
  password: string;
  name: string;
  confirm_password: string | undefined;
};

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    name: yup.string().required(),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password")], "Password must match!"),
  })
  .required();

function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmationPassword, setShowConfirmationPassword] =
    useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UserAuthForm>({
    resolver: yupResolver(schema),
  });

  const [registerMutation] = authApi.useRegisterMutation();

  const onSubmit = async (data: UserAuthForm) => {
    try {
      const res = await registerMutation(data).unwrap();

      if (res.success) {
        const user = await signIn("credentials", {
          email: data.email,
          password: data.password,
          callbackUrl: searchParams.get("callbackUrl") || "/",
          redirect: false,
        });

        router.push(user?.url || "/");
      } else {
        toast({
          title: "Something wrong",
          description: "Check email and password",
          variant: "destructive",
          duration: 2000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-[100%]">
      <div className="w-[100%] text-3xl font-semibold tracking-widest mb-2 text-center">
        Buat akun baru
      </div>
      <Input
        className="w-[100%] mt-4"
        type="text"
        placeholder="Nama Lengkap"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        className="w-[100%] mt-4"
        type="text"
        placeholder="Email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        className="w-[100%] mt-4"
        type={showPassword ? "text" : "password"}
        placeholder="Kata Sandi"
        suffix="Eye"
        onPressSuffix={() => setShowPassword(!showPassword)}
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        className="w-[100%] mt-4"
        type={showConfirmationPassword ? "text" : "password"}
        placeholder="Konfirmasi Kata Sandi"
        suffix="Eye"
        onPressSuffix={() =>
          setShowConfirmationPassword(!showConfirmationPassword)
        }
        error={errors.confirm_password?.message}
        {...register("confirm_password")}
      />

      <Button
        type="submit"
        className={cn("w-[320px] bg-leaf mt-6 mx-auto", hover.shadow)}
      >
        Buat Akun
      </Button>
    </form>
  );
}

export default SignUpForm;
