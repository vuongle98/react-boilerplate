import { AppProviders } from "@/app/providers";
import { AppRouter } from "@/app/router";

/**
 * Root App component
 * Wraps the entire application with providers and routing
 */
export const App = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};

export default App;
