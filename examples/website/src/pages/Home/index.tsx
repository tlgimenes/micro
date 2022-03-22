import Action from "../../components/Action.tsx";
import Feature from "../../components/Feature.tsx";
import Hero from "../../components/Hero.tsx";
import Section from "../../components/Section.tsx";

export function Head() {
  return (
    <>
      <meta name="robots" content="index,follow" />
      <title>Micro.ts - A minimalistic framework</title>
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

      <Section
        id="features"
        className="w-full bg-white pt-7 pb-7 md:pt-20 md:pb-24"
      >
        <Feature
          variant="left"
          icon="server"
          title="Server Components"
          subtitle="Have the best performance web can offer by moving logic from client to server"
          features={[
            "Zero bundle size components",
            "Less roundtrips to the server",
            "Offload complex operations to the edge",
          ]}
        />
        <Feature
          variant="right"
          icon="cast"
          title="Stream Rendering"
          subtitle="Return content to the user as soon as it's ready"
          features={[
            "Progressive rendering",
            "App Shell logic",
            "Web Compatible",
          ]}
        />
        <Feature
          variant="left"
          icon="cloud"
          title="Edge Native"
          subtitle="Run the server near your users"
          features={["Deno deploy", "Vercel"]}
        />
        <Feature
          variant="right"
          icon="image"
          title="Image optimization"
          subtitle="Optimize images to best fit your user devices"
          features={[
            "Encoding optimization (WebP, Jpeg2)",
            "Responsive images",
            "Image Preload",
          ]}
        />
        <Feature
          variant="left"
          icon="activity"
          title="Lazy Rendering"
          subtitle="Defer non-blocking computations"
          features={["Client Side Rendering", "Server Side Rendering"]}
        />
      </Section>

      <Action
        title="Built for performance"
        subtitle="Test Micro real world performance at Google Page Speed Insights"
        action="Test"
        href="/"
      />

      <Section className="py-20 bg-white">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl xl:text-6xl">
            Use the future of the Web today
          </h2>
          <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Start learning Micro.ts by folowing the tutorial. Become a pro by
            reading our docs
          </p>
          <div className="flex justify-center mt-8 space-x-3">
            <a
              href="#"
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow hover:bg-indigo-700"
            >
              Quickstart
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200"
            >
              Docs
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
