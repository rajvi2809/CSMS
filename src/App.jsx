import AllRoutes from "./AllRoutes";
import { ToastContainer, Slide } from "react-toastify";

export default function App() {
  return (
    <>
      <ToastContainer transition={Slide} autoClose={2000} stacked />
      <AllRoutes />
    </>
  );
}
