import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { InAppNotificationBanner } from "./src/components/notification/InAppNotificationBanner";
import { AuthProvider } from "./src/context/AuthContext";
import { SocketProvider } from "./src/context/SocketContext";
import { ChatProvider } from "./src/context/ChatContext";
import Navigation from "./src/navigation";
import { store } from "./src/stores/store";

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AuthProvider>
            <SocketProvider>
              <ChatProvider>
                <Navigation />
                <InAppNotificationBanner />
              </ChatProvider>
            </SocketProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
