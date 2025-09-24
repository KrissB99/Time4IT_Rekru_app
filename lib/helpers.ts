export function formatDate(input: string) { 
    const date = new Date(input)
    return date.toLocaleDateString("pl-PL", { 
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}