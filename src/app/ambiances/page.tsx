import type { Metadata } from "next";
import { AmbiancePreview } from "@/components/elevator/AmbiancePreview";

export const metadata: Metadata = {
  title: "Ambiances — ascenseur",
  robots: { index: false },
};

export default function AmbiancesPage() {
  return <AmbiancePreview />;
}
