import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./src/navigation";
import { Provider } from "react-redux";
import { store } from "./src/stores/store";

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Navigation />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
