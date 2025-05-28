import RouterComponent from "./routes";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingOverlay from "react-loading-overlay-ts";
import { useContext } from "react";
import LoadingProvider, {
  LoadingContext,
} from "./pages/Client/Order/Order-All/LoadingContext"; // Import the provider component

const App = () => {
  const { isActive } = useContext(LoadingContext);
  return (
    <LoadingProvider>
      {" "}
      {/* Wrap the App component with the provider */}
      <LoadingOverlay active={isActive} spinner text="Loading">
        <RouterComponent />
        <ToastContainer position="bottom-right" />
      </LoadingOverlay>
    </LoadingProvider>
  );
};

export default App;
