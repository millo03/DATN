export function Convert_Color(colorItem: string) {
    const item = colorItem.trim();
    let color: string;
    if (item == 'Red' || item == 'Đỏ' || item == 'đỏ') {
        color = 'bg-red-500 border-none'
    }
    else if (item == 'Black' || item == 'Đen' || item == 'đen') {
        color = 'bg-black border-none'
    }
    else if (item == 'vàng' || item == 'Yellow') {
        color = 'bg-yellow-500 border-none'
    }
    else if (item == 'hồng' || item == 'pink') {
        color = 'bg-yellow-500 border-none'
    }
    else if (item == 'green' || item == 'Xanh lá') {
        color = 'bg-green-500 border-none'
    }
    else if (item == 'tím' || item == 'Violet') {
        color = 'bg-violet-500 border-none'
    }
    else if (item == 'Blue' || item == 'Xanh') {
        color = 'bg-blue-500 border-none'
    }
    else if (item == 'nâu' || item == 'Brow') {
        color = 'bg-amber-950 border-none'
    }
    else {
        color = 'bg-white border !border-black after:!border-black'
    }
    return color;
}