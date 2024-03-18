"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import Link from "next/link";
import React from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SignInCredentials } from "@/types/user";
import { authService } from "@/services/auth";
import { error, success } from "@/components/alert";
import NetworkError from "@/utils/network-error";
import { setCookie } from "cookies-next";
import { userService } from "@/services/user";
import { useFcmToken } from "@/hook/use-fcm-token";
import useUserStore from "@/global-store/user";
import { useRouter, useSearchParams } from "next/navigation";
import { useSyncServer } from "@/hook/use-sync-server";
import SocialLogin from "../social-login";

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});
type FormType = yup.InferType<typeof schema>;

const Login = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { handleSync } = useSyncServer();
  const { mutate: signIn, isLoading: isSigningIn } = useMutation({
    mutationFn: (body: SignInCredentials) => authService.login(body),
    onError: (err: NetworkError) => {
      error(err.message);
    },
  });
  const { fcmToken } = useFcmToken();
  const localSignIn = useUserStore((state) => state.signIn);
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormType>({
    resolver: yupResolver(schema),
  });
  const handleLogin = (data: FormType) => {
    const body: SignInCredentials = {
      password: data.password,
    };
    if (data.username.includes("@")) {
      body.email = data.username;
    } else {
      body.phone = data.username.replace(/[^0-9]/g, "");
    }
    signIn(body, {
      onSuccess: (res) => {
        success("successfully.logged.in");
        setCookie("token", `${res.data.token_type} ${res.data.access_token}`);
        if (fcmToken) {
          userService.updateFirebaseToken({ firebase_token: fcmToken });
        }
        localSignIn(res.data.user);
        handleSync();
        if (searchParams.has("redirect")) {
          router.replace(searchParams.get("redirect") as string);
        } else {
          router.replace("/");
        }
      },
    });
  };
  return (
    <>
      <div className="flex flex-col gap-6  lg:px-10 md:px-6 sm:px-4 px-2 pt-8 pb-6">
        <h1 className="font-semibold text-[30px] mb-2 text-start">{t("login")}</h1>
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="flex flex-col gap-3 mb-3 w-full">
            <Input
              {...register("username")}
              error={errors.username?.message}
              fullWidth
              label={t("email.or.phone")}
            />
            <Input
              {...register("password")}
              error={errors.password?.message}
              fullWidth
              label={t("password")}
              type="password"
            />
          </div>
          <Button loading={isSigningIn} disabled={Boolean(queryClient.isMutating())} fullWidth>
            {t("sign.in")}
          </Button>
        </form>
        <Link href="/forgot-password" className="font-medium text-center">
          {t("forgot.password")}
        </Link>
      </div>
      <SocialLogin />
    </>
  );
};

export default Login;
