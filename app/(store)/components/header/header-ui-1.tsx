import Link from "next/link";
import { SearchField } from "@/components/search-field";
import { MegaMenu } from "../mega-menu";
import { AddressDropdown } from "../address-dropdown";
import { NotificationCenter } from "../notification-center";

export const HeaderUI1 = ({ settings }: { settings: Record<string, string> }) => (
  <header className="px-4 py-6">
    <div className="flex items-center justify-between gap-8">
      <div className="flex items-center gap-5">
        <MegaMenu />
        <Link href="/" className="text-xl font-semibold">
          {settings.title}
        </Link>
      </div>
      <div className="flex items-center justify-end md:gap-8 gap-4 flex-1">
        <SearchField visibleOnMobile={false} />
        <AddressDropdown />
        <NotificationCenter />
      </div>
    </div>
  </header>
);
