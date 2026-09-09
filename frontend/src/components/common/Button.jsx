const Button = ({
    children,
    type = "button",
    className = "",
    disabled = false,
    ...props
}) => {
    return (
        <button
            type={type}
            disabled={disabled}
            className={`
                w-full
                bg-blue-600
                hover:bg-blue-700
                text-white
                py-2.5
                rounded-lg
                font-medium
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;