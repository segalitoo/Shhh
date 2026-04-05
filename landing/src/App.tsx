import { Hero } from "./components/sections/Hero";
import { Problem } from "./components/sections/Problem";
import { DesignExploration } from "./components/sections/DesignExploration";
import { ThePill } from "./components/sections/ThePill";
import { UserFlow } from "./components/sections/UserFlow";
import { CraftDetails } from "./components/sections/CraftDetails";
import { Footer } from "./components/sections/Footer";

function Divider() {
  return <div className="divider my-4" />;
}

export function App() {
  return (
    <main>
      <Hero />
      <Divider />
      <Problem />
      <Divider />
      <DesignExploration />
      <Divider />
      <ThePill />
      <Divider />
      <UserFlow />
      <Divider />
      <CraftDetails />
      <Footer />
    </main>
  );
}
