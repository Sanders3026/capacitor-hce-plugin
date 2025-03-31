import { HCECapacitorPlugin } from "..";

const StartIosEmulation = (value:string)=> {
    //@ts-ignore
    HCECapacitorPlugin.StartIosEmulation({Data:value});
}
//vajag pielikt pie definitions.ts start emulation and other
export default StartIosEmulation;