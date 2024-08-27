import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

interface ButtonSubmitProps {
    children: React.ReactNode
    disabled?: boolean
    onClick?: () => void
    variant?: 'default' | 'outline'
}

export function ButtonIconEdit({children, disabled = false, onClick}: ButtonSubmitProps) {
    return <Button variant="outline" size="sm"
                   className={"text-jade-800 hover:border-jade-800 hover:text-jade-800 transition-all duration-300"}
                   onClick={onClick}
    >
        {children}
    </Button>;
}

export function ButtonIconDelete({children, disabled = false, onClick}: ButtonSubmitProps) {
    return <Button variant="outline" size="sm"
                   className={"text-jade-950 hover:text-jade-950 hover:bg-jade-500 transition-all duration-300"}
                   onClick={onClick}
    >
        {children}
    </Button>;
}

/*
export function ButtonSubmit({children, disabled = false, onClick}: ButtonSubmitProps) {
    return <Button
        className={`bg-jade-500 text-jade-950 hover:bg-jade-600 hover:text-jade-950 active:bg-jade-700 active:text-jade-950 ${disabled ? "disabled:text-jade-600 disabled:bg-jade-100" : ""}`}
        type="submit"
        disabled={disabled}
        onClick={onClick}
    >
        {children}
    </Button>;
}*/

export function ButtonSubmit({
                                 children,
                                 disabled = false,
                                 onClick,
                                 variant = 'default'
                             }: ButtonSubmitProps) {
    const baseClasses = "transition-colors duration-200"
    const defaultClasses = cn(
        baseClasses,
        "bg-jade-500 text-jade-950 hover:bg-jade-600 hover:text-jade-950 active:bg-jade-700 active:text-jade-950",
        disabled && "disabled:text-jade-600 disabled:bg-jade-100"
    )
    const outlineClasses = cn(
        baseClasses,
        " text-jade-950 hover:bg-jade-50 hover:text-jade-600 active:bg-jade-100 active:text-jade-700",
        disabled && "disabled:border-jade-200 disabled:text-jade-200 disabled:bg-transparent"
    )

    return (
        <Button
            className={variant === 'outline' ? outlineClasses : defaultClasses}
            type="submit"
            disabled={disabled}
            onClick={onClick}
            variant={variant}
        >
            {children}
        </Button>
    )
}

