import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { colors } from "@/design/system";

export function BrandLogo({ size = 36, framed = false }: { size?: number; framed?: boolean }) {
  const imageRatio = framed ? 0.62 : 0.8;

  return (
    <View style={[styles.base, framed && styles.framed, { width: size, height: size }]}>
      <Image
        source={require("@/assets/etqan-logo.png")}
        style={{ width: size * imageRatio, height: size * imageRatio }}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
  framed: { borderRadius: 12, backgroundColor: colors.navy },
});
