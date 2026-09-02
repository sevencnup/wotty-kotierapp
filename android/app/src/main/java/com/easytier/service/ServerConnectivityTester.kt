package com.easytier.service

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import java.io.IOException
import java.net.ConnectException
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.InetSocketAddress
import java.net.Socket
import java.net.SocketTimeoutException
import java.net.URI
import java.net.UnknownHostException
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit
import javax.net.ssl.SSLException

enum class ServerConnectivityStatus {
    SUCCESS,
    WARNING,
    FAILURE,
}

data class ServerConnectivityResult(
    val status: ServerConnectivityStatus,
    val message: String,
)

/**
 * 服务器地址的轻量连通性探测。
 *
 * 这里测试的是传输层或 HTTP 握手是否能到达，不是完整的 EasyTier 加入网络流程；
 * 网络名称、密钥或节点配置错误仍需要通过启动网络进一步确认。
 */
object ServerConnectivityTester {
    private const val CONNECT_TIMEOUT_MS = 5_000
    private const val READ_TIMEOUT_MS = 5_000

    private val httpClient = OkHttpClient.Builder()
        .connectTimeout(CONNECT_TIMEOUT_MS.toLong(), TimeUnit.MILLISECONDS)
        .readTimeout(READ_TIMEOUT_MS.toLong(), TimeUnit.MILLISECONDS)
        .writeTimeout(READ_TIMEOUT_MS.toLong(), TimeUnit.MILLISECONDS)
        .build()

    suspend fun test(rawUrl: String): ServerConnectivityResult = withContext(Dispatchers.IO) {
        val parsed = parse(rawUrl)
        if (parsed == null) {
            val result = failure("地址格式不正确，请使用 tcp://、udp://、ws:// 或 wss://")
            LogService.error(
                "服务器连通性测试失败: 地址格式不正确",
                source = "ServerConnectivity",
            )
            return@withContext result
        }

        val target = parsed.displayTarget
        LogService.info("开始测试服务器连通性: " + target, source = "ServerConnectivity")

        try {
            val result = when (parsed.scheme) {
                "tcp" -> testTcp(parsed.host, parsed.port)
                "ws", "wss" -> testWebSocket(parsed.originalUrl)
                "http", "https" -> testHttp(parsed.originalUrl)
                "udp", "wg" -> testUdp(parsed.host, parsed.port)
                else -> failure("暂不支持 " + parsed.scheme + " 协议的连通性测试")
            }
            logResult(target, result)
            result
        } catch (error: Exception) {
            val result = failure(readableError(error))
            LogService.error(
                "服务器连通性测试异常: " + target + ", " + result.message,
                source = "ServerConnectivity",
            )
            result
        }
    }

    private fun testTcp(host: String, port: Int): ServerConnectivityResult {
        Socket().use { socket ->
            socket.connect(InetSocketAddress(host, port), CONNECT_TIMEOUT_MS)
            socket.soTimeout = READ_TIMEOUT_MS
        }
        return success("TCP 连接成功，服务器端口可达")
    }

    private fun testHttp(url: String): ServerConnectivityResult {
        val request = Request.Builder()
            .url(url)
            .get()
            .header("Cache-Control", "no-cache")
            .build()
        httpClient.newCall(request).execute().use { response ->
            return if (response.isSuccessful || response.isRedirect) {
                success("HTTP 响应正常（" + response.code + "）")
            } else {
                failure("HTTP 返回错误状态码 " + response.code)
            }
        }
    }

    private fun testWebSocket(url: String): ServerConnectivityResult {
        val latch = CountDownLatch(1)
        var result: ServerConnectivityResult? = null
        val webSocket = httpClient.newWebSocket(
            Request.Builder().url(url).build(),
            object : WebSocketListener() {
                override fun onOpen(webSocket: WebSocket, response: okhttp3.Response) {
                    result = success("WebSocket 握手成功，服务器可达")
                    webSocket.close(1000, "connectivity test")
                    latch.countDown()
                }

                override fun onFailure(
                    webSocket: WebSocket,
                    t: Throwable,
                    response: okhttp3.Response?,
                ) {
                    result = failure(readableError(t, response?.code))
                    latch.countDown()
                }
            },
        )

        if (!latch.await(CONNECT_TIMEOUT_MS.toLong() + READ_TIMEOUT_MS, TimeUnit.MILLISECONDS)) {
            webSocket.cancel()
            return failure("WebSocket 握手超时（" + (CONNECT_TIMEOUT_MS / 1000 + READ_TIMEOUT_MS / 1000) + " 秒）")
        }
        return result ?: failure("WebSocket 未返回握手结果")
    }

    private fun testUdp(host: String, port: Int): ServerConnectivityResult {
        DatagramSocket().use { socket ->
            socket.soTimeout = READ_TIMEOUT_MS
            socket.connect(InetSocketAddress(host, port))
            val probe = byteArrayOf(0)
            socket.send(DatagramPacket(probe, probe.size))
            return try {
                val buffer = ByteArray(64)
                socket.receive(DatagramPacket(buffer, buffer.size))
                success("UDP 探测收到服务器响应，地址可达")
            } catch (_: SocketTimeoutException) {
                warning("UDP 探测已发出，但服务器未返回通用响应；地址已解析，是否能加入网络仍需实际启动确认")
            }
        }
    }

    private fun parse(rawUrl: String): ParsedServerUrl? {
        val value = rawUrl.trim()
        if (value.isBlank()) return null

        return try {
            val uri = URI(value)
            val scheme = uri.scheme?.lowercase() ?: return null
            val host = uri.host?.trim().orEmpty()
            val port = when {
                uri.port in 1..65535 -> uri.port
                scheme == "http" || scheme == "ws" -> 80
                scheme == "https" || scheme == "wss" -> 443
                else -> -1
            }
            if (host.isBlank() || port !in 1..65535) return null
            if (scheme !in setOf("tcp", "udp", "wg", "ws", "wss", "http", "https")) return null
            ParsedServerUrl(
                scheme = scheme,
                host = host,
                port = port,
                originalUrl = value,
                displayTarget = scheme + "://" + host + ":" + port,
            )
        } catch (_: Exception) {
            null
        }
    }

    private fun readableError(error: Throwable, responseCode: Int? = null): String {
        if (responseCode != null) return "服务器拒绝握手（HTTP " + responseCode + "）"
        return when (error) {
            is UnknownHostException -> "DNS 解析失败：找不到主机"
            is SocketTimeoutException -> "连接超时（" + CONNECT_TIMEOUT_MS / 1000 + " 秒）"
            is ConnectException -> "连接被拒绝，端口可能未开放"
            is SSLException -> "TLS/SSL 握手失败：证书或加密配置异常"
            is IOException -> error.message?.takeIf { it.isNotBlank() } ?: "网络 I/O 失败"
            else -> error.message?.takeIf { it.isNotBlank() } ?: "未知错误"
        }
    }

    private fun logResult(target: String, result: ServerConnectivityResult) {
        when (result.status) {
            ServerConnectivityStatus.SUCCESS -> LogService.info(
                "服务器连通性测试成功: " + target + ", " + result.message,
                source = "ServerConnectivity",
            )
            ServerConnectivityStatus.WARNING -> LogService.warn(
                "服务器连通性测试警告: " + target + ", " + result.message,
                source = "ServerConnectivity",
            )
            ServerConnectivityStatus.FAILURE -> LogService.error(
                "服务器连通性测试失败: " + target + ", " + result.message,
                source = "ServerConnectivity",
            )
        }
    }

    private fun success(message: String) =
        ServerConnectivityResult(ServerConnectivityStatus.SUCCESS, message)

    private fun warning(message: String) =
        ServerConnectivityResult(ServerConnectivityStatus.WARNING, message)

    private fun failure(message: String) =
        ServerConnectivityResult(ServerConnectivityStatus.FAILURE, message)

    private data class ParsedServerUrl(
        val scheme: String,
        val host: String,
        val port: Int,
        val originalUrl: String,
        val displayTarget: String,
    )
}
