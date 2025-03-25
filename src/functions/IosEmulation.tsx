import { HCECapacitorPlugin } from "..";

const StartIosEmulation = (value:string)=> {
    //@ts-ignore
    HCECapacitorPlugin.StartEmulation({Data:value});
}
//vajag pielikt pie definitions.ts start emulation and other
export default StartIosEmulation;