import React from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
} from "react-native";


interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, error, ...props }) => {
  return (
    <View className="mb-4">
      {label && <Text className="text-darkText font-semibold mb-1">{label}</Text>}
      <TextInput
        className={`bg-white border rounded-lg px-4 py-3 text-darkText ${
          error ? "border-danger" : "border-gray-300"
        }`}
        placeholderTextColor="#9ca3af"
        {...props}
      />
      {error && <Text className="text-danger text-xs mt-1">{error}</Text>}
    </View>
  );
};


