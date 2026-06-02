export const colors = {
  navy: "#14496F",
  navyDark: "#0D3554",
  navySoft: "#EAF3F8",
  cream: "#F0E3CA",
  creamSoft: "#FBF7EF",
  brown: "#602705",
  orange: "#E18B01",
  orangeSoft: "#FFF4DF",
  ink: "#183044",
  muted: "#6D7C86",
  line: "#E4E9EC",
  canvas: "#F4F7F9",
  white: "#FFFFFF",
  green: "#2C8061",
  greenSoft: "#EAF7F0",
  red: "#C73D3D",
  redSoft: "#FDEEEE",
  purple: "#7667A8",
  purpleSoft: "#F0EDFA",
};

export const shadow = {
  boxShadow: "0 12px 32px rgba(20, 73, 111, 0.10)",
} as const;

export type Tone = "blue" | "cream" | "orange" | "green" | "red" | "purple";

export const toneBackground: Record<Tone, string> = {
  blue: colors.navySoft,
  cream: colors.creamSoft,
  orange: colors.orangeSoft,
  green: colors.greenSoft,
  red: colors.redSoft,
  purple: colors.purpleSoft,
};
