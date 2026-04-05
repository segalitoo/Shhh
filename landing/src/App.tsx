import { Hero } from "./components/sections/Hero";
import { Problem } from "./components/sections/Problem";
import { DesignExploration } from "./components/sections/DesignExploration";
import { ThePill } from "./components/sections/ThePill";
import { UserFlow } from "./components/sections/UserFlow";
import { CraftDetails } from "./components/sections/CraftDetails";
import { Footer } from "./components/sections/Footer";

export function App() {
  return (
    <main>
      <Hero />
      <Problem />
      <DesignExploration />
      <ThePill />
      <UserFlow />
      <CraftDetails />
      <Footer />
    </main>
  );
}
