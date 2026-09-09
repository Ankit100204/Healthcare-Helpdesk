import React from "react";

const Input = React.forwardRef(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1">
                {label && (
                    <label className="block text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}

                <input
                    ref={ref}
                    {...props}
                    className={`w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 ${className}`}
                />

                {error && (
                    <p className="text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;