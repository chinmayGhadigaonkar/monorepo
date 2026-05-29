import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return format(date, "do MMMM yyyy, hh:mm a");
};
