import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";

interface DatePickerFieldProps {
    label: string;
    value?: string;
    onChange: (val: string) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    showCurrentOption?: boolean;
    maximumDate?: Date;
    minimumDate?: Date;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
    label,
    value,
    onChange,
    placeholder = "Seleccionar fecha",
    error,
    showCurrentOption,
    maximumDate,
    minimumDate,
}) => {
    const [showPicker, setShowPicker] = useState(false);

    const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShowPicker(false);
        if (event.type === "dismissed") return;
        if (selectedDate) {
        const formatted = selectedDate.toLocaleString("es-ES", { month: "long", year: "numeric" });
        onChange(formatted.charAt(0).toUpperCase() + formatted.slice(1));
        }
    };

    return (
        <View className="mb-4">
        <Text className="text-darkText font-semibold mb-1">{label}</Text>
        <TouchableOpacity
            className={`bg-white border rounded-lg px-4 py-3 ${
            error ? "border-danger" : "border-gray-300"
            }`}
            onPress={() => setShowPicker(true)}
        >
            <Text className={`${value ? "text-darkText" : "text-gray-400"}`}>
            {value || placeholder}
            </Text>
        </TouchableOpacity>

        {showCurrentOption && (
            <TouchableOpacity
            className="mt-2 self-start"
            onPress={() => onChange("Actual")}
            >
            <Text className="text-blue-600 text-sm">Actualmente trabajando aquí</Text>
            </TouchableOpacity>
        )}

        {showPicker && (
            <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            onChange={handleChange}
            />
        )}

        {error && <Text className="text-danger text-xs mt-1">{error}</Text>}
        </View>
    );
};
