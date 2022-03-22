import Action from "../../components/Action.tsx";
import Features from "../../components/Features.tsx";
import Hero from "../../components/Hero.tsx";

export function Head() {
  return (
    <>
      <meta name="robots" content="index,follow" />
      <title>Micro.ts - A minimalistic framework</title>
      <meta name="description" content="React meets Deno"/>
    </>
  );
}

export function Main() {
  return (
    <>
      <Hero
        title="React meets Deno"
        subtitle="Speed up your React App by Streaming on the Edge, Lazy rendering and Server Components."
        action="Learn More"
        link="#features"
      />

      <Features
        className="bg-slate-100"
        id="features"
        features={[
          {
            icon: "server",
            title: "Server Components",
            subtitle:
              "Have the best performance web can offer by moving logic from client to server",
            highlights: [
              "Zero bundle size components",
              "Less roundtrips to the server",
              "Offload complex operations to the edge",
            ],
          },
          {
            icon: "cast",
            title: "Stream Rendering",
            subtitle: "Return content to the user as soon as it's ready",
            highlights: [
              "Progressive rendering",
              "App Shell logic",
              "Web Compatible",
            ],
          },
          {
            icon: "cloud",
            title: "Edge Native",
            subtitle: "Run the server near your users",
            highlights: ["Deno deploy", "Vercel"],
          },
          {
            icon: "image",
            title: "Image optimization",
            subtitle: "Optimize images to best fit your user devices",
            highlights: [
              "Encoding optimization (WebP, Jpeg2)",
              "Responsive images",
              "Image Preload",
            ],
          },
          {
            icon: "activity",
            title: "Lazy Rendering",
            subtitle: "Defer non-blocking computations",
            highlights: ["Client Side Rendering", "Server Side Rendering"],
          },
        ]}
      />

      <Action
        title="Built for performance"
        subtitle="Test Micro real world performance at Google Page Speed Insights"
        links={[
          {
            name: "Test",
            href: "/",
          },
          undefined,
        ]}
      />

      <Action
        className="bg-slate-100"
        title="Use the future of the Web today"
        subtitle="Start learning Micro.ts by folowing the tutorial. Become a pro by reading our docs"
        links={[
          {
            name: "Quickstart",
            href: "/quickstart",
          },
          {
            name: "Docs",
            href: "/docs",
          },
        ]}
      />
    </>
  );
}
