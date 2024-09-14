package com.thanmgan22.plugins.nfchce

import android.app.Activity
import android.content.ComponentName
import android.content.Intent
import android.content.pm.PackageManager
import android.nfc.NfcAdapter
import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "HCECapacitorPlugin")
class HCECapacitorPluginPlugin : Plugin() {

    private var mNfcAdapter: NfcAdapter? = null

    override fun load() {
        mNfcAdapter = NfcAdapter.getDefaultAdapter(activity)
    }

    @PluginMethod
    fun startNfcHce(call: PluginCall) {
        val ret: JSObject = JSObject()
        val content: String = call.getString("content").toString()
        var mimeType: String = call.getString("mimeType").toString()
        val persistMessage: Boolean = call.getBoolean("persistMessage") == true
        Log.i("NFC HCE", "---------------------->isNfcHceSupported: " + _isNfcHceSupported())
        if(mimeType == "null") {
            mimeType = "RTD_URI"
        }
        if (_isNfcHceSupported()) {
            initService(content, mimeType, persistMessage)
            ret.put("success", true)
        } else {
            ret.put("success", false)
        }
        call.resolve(ret)
    }

    @PluginMethod
    fun stopNfcHce(call: PluginCall) {
        val ret: JSObject = JSObject()
        val intent = Intent(activity, KHostApduService::class.java)
        activity?.stopService(intent)
        ret.put("success", true)
        call.resolve(ret)
    }

    @PluginMethod
    @RequiresApi(Build.VERSION_CODES.Q)
     fun isSecureNfcEnabled(call: PluginCall) {
        Log.i("NFC HCE", "---------------------->isSecureNfcEnabled: " + mNfcAdapter?.isSecureNfcEnabled)
        val ret: JSObject = JSObject()
        ret.put("enabled", mNfcAdapter?.isSecureNfcEnabled == true)
        call.resolve(ret)
    }

    @PluginMethod
    fun isNfcEnabled (call: PluginCall) {
        val ret: JSObject = JSObject()
        ret.put("enabled", _isNfcEnabled())
        call.resolve(ret)
    }

    @PluginMethod
    fun isNfcHceSupported (call: PluginCall) {
        val ret: JSObject = JSObject()
        ret.put("supported", _isNfcHceSupported())
        call.resolve(ret)
    }

    @PluginMethod
    fun isNfcSupported(call: PluginCall) {
        val ret: JSObject = JSObject()
        ret.put("supported", mNfcAdapter != null)
        call.resolve(ret)
    }

    @PluginMethod
    fun enableApduService(call: PluginCall) {
        val enable: Boolean = call.getBoolean("enable") == true
        val pm = activity?.packageManager
        val state = if (enable) {
            PackageManager.COMPONENT_ENABLED_STATE_ENABLED
        } else {
            PackageManager.COMPONENT_ENABLED_STATE_DISABLED
        }
        activity?.applicationContext?.let {
            pm?.setComponentEnabledSetting(
                ComponentName(it, "com.thanmgan22.plugins.nfchce.KHostApduService"),
                state,
                PackageManager.DONT_KILL_APP
            )
        }
        val ret: JSObject = JSObject()
        ret.put("enabled", _isNfcEnabled())
        call.resolve(ret)
    }

    private fun initService(content: String, mimeType: String, persistMessage: Boolean) {
        val intent = Intent(activity, KHostApduService::class.java)
        intent.putExtra("content", content)
        intent.putExtra("mimeType", mimeType)
        intent.putExtra("persistMessage", persistMessage)
        activity?.startService(intent)
    }

    private fun _isNfcHceSupported() =
        _isNfcEnabled() && activity?.packageManager!!.hasSystemFeature(PackageManager.FEATURE_NFC_HOST_CARD_EMULATION)

    private fun _isNfcEnabled(): Boolean {
        return mNfcAdapter?.isEnabled == true
    }
}
