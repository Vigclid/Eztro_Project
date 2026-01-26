import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface AvatarProps {
  source?: ImageSourcePropType;
  size?: number;
  name?: string;
  backgroundColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 60,
  name,
  backgroundColor = "#ccc",
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: backgroundColor,
        },
      ]}
    >
      {source ? (
        <Image
          source={source}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
        />
      ) : (
        <Text style={[styles.initial, { fontSize: size / 2 }]}>
          {name ? name.charAt(0).toUpperCase() : "?"}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  initial: {
    color: "white",
    fontWeight: "bold",
  },
});
