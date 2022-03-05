from tkinter import N
import numpy as np
import matplotlib.pyplot as plt

if __name__ == "__main__":
    # Step 2: Populate the node grid with random vector units
    def random_unit_vector(x, y):
        w = 32
        s = 16
        a = x
        b = y

        a *= 3284157443
        b ^= a << s | a >> w-s
        b *= 1911520717
        a ^= b << s | b >> w-s
        a *= 2048419325

        random = (a % 100000) / 100000
        theta = random * 2 * np.math.pi

        return np.array([np.math.cos(theta), np.math.sin(theta)])


    # Step 3: We need to accept the input to the function a two-dimensioanl argument
    def perlin_noise(x: int ,y: int) -> float:
        """Depending on the coordinates provided. Generate the corresponding intensity 
            (height) of the perlin noise map.    

        Args:
            x (int): X Coordinate
            y (int): Y Coordinate

        Returns:
            float: Intensity based on the coordinates
        """
        # Step 4: Determine its cell in the grid, where the "cell" is the square of
        # nodes around our x and y.
        x0 = np.math.floor(x)
        x1 = x0 + 1
        y0 = np.math.floor(y)
        y1 = y0 + 1

        # Step 4.0.1: Determine the interpolation weights
        sx = x - float(x0)
        sy = y - float(y0)

        # Step 4.1: Calculate the dot product between the distance bector between the 
        # point and the node and the random gradient bector from our array.
        def dotGridGradient(ix: int, iy: int, x: float, y: float) -> float:
            """Computes the dot product of the distance and gradient vectors

            Args:
                gradX (int): the x component of the random unit vector
                gradY (int): the y component of the random unit vector
                x (float): actual coordinates
                y (float): actual coordinates

            Returns:
                float: the dot product of the distance and the gradient vectors
            """
            gradX, gradY = random_unit_vector(ix, iy)
            dx = x - float(ix)
            dy = y - float(iy)

            return ((dx * gradX) + (dy * gradY))

        # Step 5: Interpolation
        def interpolate(a0: float, a1: float, w: float) -> float:
            if w < 0:
                return 0
            elif w > 1:
                return 1 
            
            return (a1 - a0) * (3.0 - w * 2.0) * w * w + a0

        n0 = dotGridGradient(x0, y0, x, y)
        n1 = dotGridGradient(x1, y0, x, y)
        ix0 = interpolate(n0, n1, sx)

        n0 = dotGridGradient(x0, y1, x, y)
        n1 = dotGridGradient(x1, y1, x, y)
        ix1 = interpolate(n0, n1, sx)

        intensity = interpolate(ix0, ix1, sy)

        return intensity

    nodes = 16
    cells = 32
    nMap = []

    for Y in range(nodes * cells):
        
        row = []
        for X in range(nodes * cells):
            row.append(perlin_noise((X / cells), (Y / cells)) +
                       (perlin_noise((X / (cells * 0.5)), (Y / (cells * 0.5))) / 2) +
                       (perlin_noise((X / (cells * 0.25)), (Y / (cells * 0.25))) / 4))

        nMap.append(row)

    plt.imshow(np.array(nMap))
    plt.show()