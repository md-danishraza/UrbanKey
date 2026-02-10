import { Provider } from "react-redux";
import { store } from ".";

// store provider
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
