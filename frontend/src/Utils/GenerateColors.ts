export function generateRandomColor() {
    const letters = "0123456789ABCDEF"
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color
}

export function generateUniqueRandomColors(quantity: number): string[]{
    const uniqueColors = new Set();
    while (uniqueColors.size < quantity) {
        const randomColor = generateRandomColor();
        uniqueColors.add(randomColor);
    }
    return Array.from(uniqueColors) as string[];
}