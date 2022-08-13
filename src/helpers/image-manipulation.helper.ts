import Jimp from "jimp";

export interface IColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

async function replaceColor(image: Jimp, fromColor: IColor, toColor: IColor) {

    const colorDistance = (c1, c2) => Math.sqrt(Math.pow(c1.r - c2.r, 2) + Math.pow(c1.g - c2.g, 2) + Math.pow(c1.b - c2.b, 2) + Math.pow(c1.a - c2.a, 2));  // Distance between two colors
    const threshold = 32;  // Replace colors under this threshold. The smaller the number, the more specific it is.

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        const thisColor = {
            r: image.bitmap.data[idx + 0],
            g: image.bitmap.data[idx + 1],
            b: image.bitmap.data[idx + 2],
            a: image.bitmap.data[idx + 3]
        };
        if (colorDistance(fromColor, thisColor) <= threshold) {
            image.bitmap.data[idx + 0] = toColor.r;
            image.bitmap.data[idx + 1] = toColor.g;
            image.bitmap.data[idx + 2] = toColor.b;
            image.bitmap.data[idx + 3] = toColor.a;
        }
    })
    return image;

}

export async function makeFuelInfoReadable(buf: Buffer): Promise<Buffer> {
    let image = await Jimp.read(buf);
    image.grayscale();
    await replaceColor(image, { r: 243, g: 243, b: 243, a: 255 }, { r: 255, g: 255, b: 255, a: 0 });
    image.scale(2)
    image.write("./test.png");
    return image.getBufferAsync("image/png");

}