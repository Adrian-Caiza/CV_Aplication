import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type DateFormat = "full" | "year";

interface DatePickerFieldProps {
    label: string;
    value: string;
    onChange: (date: string) => void;
    placeholder?: string;
    required?: boolean;
    maximumDate?: Date;
    minimumDate?: Date;
    showCurrentOption?: boolean;
    formatType?: DateFormat;
    onCurrentPress?: () => void;
    error?: string;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
    label,
    value,
    onChange,
    placeholder = "Seleccionar fecha",
    required = false,
    maximumDate,
    minimumDate,
    showCurrentOption = false,
    formatType,
    onCurrentPress,
    error,
}) => {
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleConfirm = (date: Date) => {
        const formattedDate = formatDate(date, formatType);
        onChange(formattedDate);
        hideDatePicker();
    };

    const formatDate = (date: Date, formatType: DateFormat = "full"): string => {
        if (formatType === "year") {
        return date.getFullYear().toString();
        }
        return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        });
    };

    const handleCurrentPress = () => {
        if (onCurrentPress) {
        onCurrentPress();
        } else {
        onChange("Actual");
        }
        hideDatePicker();
    };

    return (
        <View style={styles.container}>
        <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
        </Text>

        <TouchableOpacity
            style={[styles.dateInput, error && styles.inputError]}
            onPress={showDatePicker}
        >
            <Text style={value ? styles.dateText : styles.placeholderText}>
            {value || placeholder}
            </Text>
        </TouchableOpacity>

        {showCurrentOption && (
            <TouchableOpacity style={styles.currentButton} onPress={handleCurrentPress}>
            <Text style={styles.currentButtonText}>
                🎯 Actualmente trabajando aquí
            </Text>
            </TouchableOpacity>
        )}

        {/* Mostrar mensaje de error debajo */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            locale="es_ES"
            cancelTextIOS="Cancelar"
            confirmTextIOS="Confirmar"
            is24Hour={true}
        />
        </View>
    );
    };

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2c3e50",
        marginBottom: 8,
    },
    required: {
        color: "#e74c3c",
    },
    dateInput: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        height: 50,
        justifyContent: "center",
    },
    inputError: {
        borderColor: "#e74c3c",
    },
    dateText: {
        fontSize: 16,
        color: "#2c3e50",
    },
    placeholderText: {
        fontSize: 16,
        color: "#95a5a6",
    },
    currentButton: {
        marginTop: 8,
        padding: 8,
        alignItems: "center",
        backgroundColor: "#e8f4fd",
        borderRadius: 6,
    },
    currentButtonText: {
        color: "#3498db",
        fontSize: 14,
        fontWeight: "500",
    },
    errorText: {
        color: "#e74c3c",
        fontSize: 12,
        marginTop: 4,
    },
    });
