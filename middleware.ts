import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fetcher from "@/lib/fetcher";
import { parseSettings } from "@/utils/parse-settings";
import { DefaultResponse, Setting } from "@/types/global";

const PUBLIC_FILE = /\.(.*)$/;

const getSettings = async () => {
  try {
    const settings = await fetcher<DefaultResponse<Setting[]>>("v1/rest/settings");
    return parseSettings(settings?.data);
  } catch (e) {
    return {};
  }
};

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const settings = await getSettings();
  if (process.env.NEXT_PUBLIC_UI_TYPE) {
    settings.ui_type = process.env.NEXT_PUBLIC_UI_TYPE;
  }
  if (PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  if (!cookies().has("token") && (pathname.includes("/profile") || pathname.includes("/orders"))) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl, 302);
  }

  const uiType = ["2", "3", "4"].find((type) => type === settings?.ui_type);

  if (!!uiType && (pathname === "/" || pathname === "/products")) {
    return NextResponse.rewrite(
      new URL(`${pathname === "/" ? `/home-${uiType}` : `${pathname}-${uiType}`}`, request.url)
    );
  }

  if (pathname.startsWith("/shops/") && !!uiType) {
    return NextResponse.rewrite(new URL(pathname.replace("shops", `shops-${uiType}`), request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)"],
};
