String.prototype.hashCode = function() {
    var hash = 0, i, chr
    if (this.length === 0) return hash
    for (i=0; i < this.length; i++) {
        chr = this.charCodeAt(i)
        hash = ((hash << 5) - hash) + chr
        hash |= 0
        // Convert to 32bit integer
    }
    return hash
}

const cyrb53 = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
};

const randomGradient = (x, y) => {
    // No precomputed gradients mean this works for any number of grid coordinates
    const w = 32
    const s = w / 2; // rotation width
    let a = x
    let b = y;
    
    a *= 3284157443; b ^= a << s | a >> w-s;
    b *= 1911520717; a ^= b << s | b >> w-s;
    a *= 2048419325;
    
    const random = (a % 100000) / 100000

    return random
}

