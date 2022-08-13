import { createWorker } from "tesseract.js";

export async function imageToText(imageBuf: Buffer): Promise<string> {
    const worker = createWorker();
    await worker.load();
    await worker.loadLanguage('nld');
    await worker.initialize('nld');
    const { data: { text } } = await worker.recognize(imageBuf);
    await worker.terminate();
    return text;

}