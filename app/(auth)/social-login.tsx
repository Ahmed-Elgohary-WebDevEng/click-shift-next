"use client";

import AppleIcon from "@/assets/icons/apple";
import FacebookIcon from "@/assets/icons/facebook";
import GoogleIcon from "@/assets/icons/google";
import { IconButton } from "@/components/icon-button";
import { useAuth } from "@/hook/use-auth";
import useUserStore from "@/global-store/user";
import { DefaultResponse } from "@/types/global";
import { SignInResponse, SocialLoginCredentials } from "@/types/user";
import { setCookie } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { authService } from "@/services/auth";
import { error } from "@/components/alert";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { useFcmToken } from "@/hook/use-fcm-token";
import { userService } from "@/services/user";
import { useSyncServer } from "@/hook/use-sync-server";

const SocialLogin = () => {
  const [loading, setLoading] = useState(false);
  const { googleSignIn, facebookSignIn, appleSignIn } = useAuth();
  const { handleSync } = useSyncServer();
  const { mutate } = useMutation({
    mutationKey: ["socialLogin"],
    mutationFn: (body: SocialLoginCredentials) => authService.socialLogin(body),
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useUserStore();
  const { t } = useTranslation();
  const { fcmToken } = useFcmToken();

  const providers = {
    google: googleSignIn,
    facebook: facebookSignIn,
    apple: appleSignIn,
  };

  const onAuthSuccess = (res: DefaultResponse<SignInResponse>) => {
    setCookie("token", `${res.data.token_type} ${res.data.access_token}`);
    if (fcmToken) {
      userService.updateFirebaseToken({ firebase_token: fcmToken });
    }
    signIn(res.data.user);
    setLoading(false);
    handleSync();
    if (searchParams.has("redirect")) {
      router.replace(searchParams.get("redirect") as string);
    } else {
      router.replace("/");
    }
  };

  const onAuthError = () => {
    setLoading(false);
  };

  const handleSocialLogin = async (type: keyof typeof providers) => {
    setLoading(true);
    try {
      await providers[type]().then(async (res) => {
        const id = await res.user.getIdToken();
        mutate(
          {
            type,
            data: {
              avatar: res.user?.photoURL,
              email: res.user.email || `${res.user.displayName?.toLowerCase() || "temp"}@mail.com`,
              id,
              name: res.user.displayName,
            },
          },
          {
            onSuccess: (data) => onAuthSuccess(data),
            onError: onAuthError,
          }
        );
      });
    } catch (e) {
      error(t(`Could not login with ${type} account`));
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 pt-8 border-t border-gray-inputBorder justify-center pb-10">
      <IconButton
        type="button"
        onClick={() => handleSocialLogin("google")}
        disabled={loading}
        size="xlarge"
        color="white"
      >
        <GoogleIcon />
      </IconButton>
      <IconButton
        type="button"
        onClick={() => handleSocialLogin("facebook")}
        disabled={loading}
        color="white"
        size="xlarge"
      >
        <FacebookIcon />
      </IconButton>
      <IconButton
        type="button"
        onClick={() => handleSocialLogin("apple")}
        disabled={loading}
        color="white"
        size="xlarge"
      >
        <AppleIcon />
      </IconButton>
    </div>
  );
};

export default SocialLogin;
