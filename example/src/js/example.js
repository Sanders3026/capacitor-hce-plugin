import { HCECapacitorPlugin } from 'hce-plugin';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    HCECapacitorPlugin.echo({ value: inputValue })
}
