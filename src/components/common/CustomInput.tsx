import React from 'react';
import { useField } from 'vee-validate';

interface CustomInputProps {
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    name: string;
    label?: string;
    rules?: string;
    disabled?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
    type = 'text',
    placeholder,
    value,
    onChange,
    className = '',
    name,
    label,
    rules,
    disabled = false,
}) => {
    const { field, errorMessage } = useField(name, rules);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        field.onChange(e);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                type={type}
                id={name}
                placeholder={placeholder}
                value={value || field.value}
                onChange={handleChange}
                onBlur={field.onBlur}
                disabled={disabled}
                className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errorMessage ? 'border-red-500' : 'border-gray-300'
                    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} ${className}`}
            />
            {errorMessage && (
                <span className="text-sm text-red-500">{errorMessage}</span>
            )}
        </div>
    );
};

export default CustomInput; 