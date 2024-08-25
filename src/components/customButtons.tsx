import {Button} from "@/components/ui/button";

export function ButtonIconEdit({children}: { children: React.ReactNode }) {
    return <Button variant="outline" size="sm"
                   className={"text-jade-800 hover:border-jade-800 hover:text-jade-800 transition-all duration-300"}>
        {children}
    </Button>;
}

export function ButtonIconDelete({children}: { children: React.ReactNode }) {
    return <Button variant="outline" size="sm"
                   className={"text-jade-950 hover:text-jade-950 hover:bg-jade-500 transition-all duration-300"}>
        {children}
    </Button>;
}

interface ButtonSubmitProps {
    children: React.ReactNode
    disabled?: boolean,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    // className?: string
}

export function ButtonSubmit({children, disabled = false, onClick}: ButtonSubmitProps) {
    return <Button
        className={`bg-jade-500 text-jade-950 hover:bg-jade-600 hover:text-jade-950 active:bg-jade-700 active:text-jade-950 ${disabled ? "disabled:text-jade-600 disabled:bg-jade-100" : ""}`}
        type="submit"
        disabled={disabled}
        onClick={onClick}
    >
        {children}
    </Button>;
}