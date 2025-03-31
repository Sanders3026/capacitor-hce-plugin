import { HCECapacitorPlugin } from "..";

const StartIosEmulation = (value:string)=> {
    //@ts-ignore
    HCECapacitorPlugin.StartIosEmulation({Data:value});
}
export default StartIosEmulation;