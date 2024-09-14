package com.thanmgan22.plugins.nfchce

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "HCECapacitorPlugin")
class HCECapacitorPluginPlugin : Plugin() {
    private val implementation: HCECapacitorPlugin = HCECapacitorPlugin()

    @PluginMethod
    fun echo(call: PluginCall) {
        val value: String = call.getString("value")

        val ret: JSObject = JSObject()
        ret.put("value", implementation.echo(value))
        call.resolve(ret)
    }
}
