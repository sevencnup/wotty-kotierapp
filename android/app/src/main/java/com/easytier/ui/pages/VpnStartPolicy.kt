package com.easytier.ui.pages

import com.easytier.data.NetworkConfig

/**
 * Resolves the address that Android should assign to the VPN TUN interface.
 * A DHCP configuration must not fall back to a made-up address when the native
 * backend has not assigned a virtual IP yet. An empty result means the caller
 * must keep the VPN stopped.
 */
internal fun resolveVpnIpv4(config: NetworkConfig, assignedIp: String): String {
    val runtimeIp = assignedIp.trim()
    if (runtimeIp.isNotBlank()) {
        return runtimeIp
    }

    return if (!config.dhcp && config.ipv4.isNotBlank()) {
        NetworkConfig.vpnIpv4Address(config.ipv4)
    } else {
        ""
    }
}
