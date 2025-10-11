import P2IconsCanvas from "@/components/pages/home/bento/resources/nuts-and-bolts-pile";


export default function Page() {
  const icons = [
    { src: "/icons/gear-1.png", shape: "rect", w: 96, h: 64, scale: 1 },
    { src: "/icons/token.svg", shape: "circle", r: 36, w: 72, h: 72, scale: 1 },
    { src: "/icons/lock.svg", shape: "rect", w: 80, h: 80, scale: 1.1 },
  ];
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 12 }}>p2-es Icons Physics</h1>
      <P2IconsCanvas icons={icons} height={520} />
    </main>
  );
}
