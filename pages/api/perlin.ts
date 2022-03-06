
interface Vector2 { x: number, y: number }

const randomUnitVector = (x: number, y: number): Vector2 => {
    // No precomputed gradients mean this works for any number of grid coordinates
    const w = 32
    const s = 16; // rotation width
    let a = x
    let b = y;

    a *= 3284157443
    b ^= a << s | a >> w - s;
    b *= 1911520717
    a ^= b << s | b >> w - s
    a *= 2048419325;

    const random = (a % 100000) / 100000
    const theta = random * 2 * Math.PI

    return {
        x: Math.cos(theta),
        y: Math.sin(theta)
    }
}

const dotGridGradient = (
    ix: number,
    iy: number,
    x: number,
    y: number
): number => {
    // Find the gradient of the corner cells
    const unitVector = randomUnitVector(ix, iy)
    const gradX = unitVector.x
    const gradY = unitVector.y

    const dx = x - ix
    const dy = y - iy

    return ((dx * gradX) + (dy * gradY))
}

const interpolate = (a0: number, a1: number, w: number): number => {
    // if (w < 0) {
    //     return 0
    // }
    // else if (w > 1) {
    //     return 1
    // }

    return (a1 - a0) * (3.0 - w * 2.0) * w * w + a0
}

export const perlinNoise = (x: number, y: number): number => {
    // Determine its cell in the grid, where the "cell" is the square of
    // nodes around our x and y.
    const x0 = Math.floor(x)
    const x1 = x0 + 1
    const y0 = Math.floor(y)
    const y1 = y0 + 1

    // Determine the interpolation weights
    const sx = x - x0
    const sy = y - y0

    let n0 = dotGridGradient(x0, y0, x, y)
    let n1 = dotGridGradient(x1, y0, x, y)
    const ix0 = interpolate(n0, n1, sx)

    n0 = dotGridGradient(x0, y1, x, y)
    n1 = dotGridGradient(x1, y1, x, y)
    const ix1 = interpolate(n0, n1, sx)

    return interpolate(ix0, ix1, sy)
}