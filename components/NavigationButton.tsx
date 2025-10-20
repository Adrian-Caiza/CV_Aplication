import React from "react";
import { Text, TouchableOpacity, ViewStyle } from "react-native";

interface NavigationButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  style?: ViewStyle;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  className = "",
  style,
}) => {
  const baseStyle = "py-4 rounded-lg items-center";
  const variantStyle =
    variant === "primary"
      ? "bg-primary"
      : "bg-gray-300";

  const textColor = variant === "primary" ? "text-white" : "text-darkText";

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${baseStyle} ${variantStyle} ${className}`}
      style={style}
    >
      <Text className={`font-semibold text-base ${textColor}`}>{title}</Text>
    </TouchableOpacity>
  );
};
