import { Navigation } from "@/components/chrome/navigation";

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <div className="page-container">{children}</div>
    </>
  );
}
