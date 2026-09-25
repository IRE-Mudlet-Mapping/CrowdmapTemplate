import { MudletMapReader } from "mudlet-map-binary-reader";
import fs from "fs";

const inputFile = "./Map/map";
const input = fs.readFileSync(inputFile);

export default input.length > 0 ? MudletMapReader.readBuffer(input) : null;
