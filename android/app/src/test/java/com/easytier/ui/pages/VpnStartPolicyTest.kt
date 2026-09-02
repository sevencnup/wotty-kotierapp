package com.easytier.ui.pages

import com.easytier.data.NetworkConfig
import org.junit.Assert.assertEquals
import org.junit.Test

class VpnStartPolicyTest {
    @Test
    fun dhcpWithoutNativeIpDoesNotUsePlaceholderAddress() {
        val config = NetworkConfig(dhcp = true, ipv4 = "10.20.30.1")

        assertEquals("", resolveVpnIpv4(config, ""))
    }

    @Test
    fun staticIpv4CanBeUsedWhenConfigured() {
        val config = NetworkConfig(dhcp = false, ipv4 = "10.20.30.1/24")

        assertEquals("10.20.30.1", resolveVpnIpv4(config, ""))
    }

    @Test
    fun nativeAssignedIpTakesPriority() {
        val config = NetworkConfig(dhcp = true)

        assertEquals("10.20.30.8", resolveVpnIpv4(config, " 10.20.30.8 "))
    }
}
