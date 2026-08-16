
const drawCircle = (centre, r, block = "Black Glass") => {
    const [cx, cy, cz] = centre;
    let x = 0, z = -r;

    while (x < -z) {
        const mid = z + 0.5;

        if (x * x + mid * mid > r * r)
            z += 1;

        api.setBlock(cx + x, cy, cz + z, block);
        api.setBlock(cx + x, cy, cz - z, block);
        api.setBlock(cx - x, cy, cz + z, block);
        api.setBlock(cx - x, cy, cz - z, block);

        api.setBlock(cx + z, cy, cz + x, block);
        api.setBlock(cx + z, cy, cz - x, block);
        api.setBlock(cx - z, cy, cz + x, block);
        api.setBlock(cx - z, cy, cz - x, block);

        x += 1;
    }
};
