package com.lcasu.iperf3;

import android.Manifest;
import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.graphics.Typeface;
import android.os.Build;
import android.os.Bundle;
import android.text.InputType;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MainActivity extends Activity {
    private TextView serverLog, clientLog, ipText;
    private EditText serverPort, host, clientPort, duration, parallel, bandwidth;
    private CheckBox udp, reverse;
    private volatile Process clientProcess;

    private final BroadcastReceiver receiver = new BroadcastReceiver() {
        @Override public void onReceive(Context context, Intent intent) {
            String s = intent.getStringExtra(IperfServerService.EXTRA_LINE);
            if (s != null) append(serverLog, s);
        }
    };

    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        if (Build.VERSION.SDK_INT >= 33 &&
                checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 10);
        }
        setContentView(buildUi());
    }

    @Override protected void onStart() {
        super.onStart();
        IntentFilter f = new IntentFilter(IperfServerService.ACTION_LOG);
        if (Build.VERSION.SDK_INT >= 33) registerReceiver(receiver, f, Context.RECEIVER_NOT_EXPORTED);
        else registerReceiver(receiver, f);
        refreshIp();
    }

    @Override protected void onStop() {
        try { unregisterReceiver(receiver); } catch (Exception ignored) {}
        super.onStop();
    }

    private View buildUi() {
        int p = dp(12);
        ScrollView outer = new ScrollView(this);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(p,p,p,p);
        outer.addView(root);

        TextView title = new TextView(this);
        title.setText("iPerf3 Android");
        title.setTextSize(26);
        title.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        root.addView(title);

        TextView sub = new TextView(this);
        sub.setText("无 Google 依赖 · Client + Server · iPerf3 3.21");
        sub.setPadding(0,0,0,dp(14));
        root.addView(sub);

        TextView sh = header("服务端");
        root.addView(sh);

        ipText = new TextView(this);
        ipText.setTextSize(16);
        root.addView(ipText);

        serverPort = field("监听端口", true, "5201");
        root.addView(serverPort);

        LinearLayout sa = row();
        Button ss = button("启动服务端");
        Button sx = button("停止服务端");
        sa.addView(ss, weight());
        sa.addView(sx, weight());
        root.addView(sa);

        ss.setOnClickListener(v -> startServer());
        sx.setOnClickListener(v -> stopServer());

        serverLog = log();
        root.addView(serverLog, new LinearLayout.LayoutParams(-1, dp(180)));

        root.addView(header("客户端"));

        host = field("服务器 IP / 域名", false, "192.168.1.2");
        clientPort = field("端口", true, "5201");
        duration = field("时长（秒）", true, "10");
        parallel = field("并发流数量", true, "1");
        bandwidth = field("UDP 带宽，例如 100M", false, "100M");
        udp = new CheckBox(this); udp.setText("UDP");
        reverse = new CheckBox(this); reverse.setText("反向测试 -R（服务端发送）");

        root.addView(host); root.addView(clientPort); root.addView(duration);
        root.addView(parallel); root.addView(bandwidth); root.addView(udp); root.addView(reverse);

        LinearLayout ca = row();
        Button cs = button("开始测试");
        Button cx = button("停止测试");
        ca.addView(cs, weight()); ca.addView(cx, weight());
        root.addView(ca);
        cs.setOnClickListener(v -> startClient());
        cx.setOnClickListener(v -> stopClient());

        clientLog = log();
        root.addView(clientLog, new LinearLayout.LayoutParams(-1, dp(260)));
        return outer;
    }

    private TextView header(String s) {
        TextView v = new TextView(this);
        v.setText(s);
        v.setTextSize(20);
        v.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        v.setPadding(0,dp(10),0,dp(6));
        return v;
    }

    private EditText field(String hint, boolean numeric, String value) {
        EditText e = new EditText(this);
        e.setHint(hint);
        e.setText(value);
        e.setSingleLine(true);
        if (numeric) e.setInputType(InputType.TYPE_CLASS_NUMBER);
        return e;
    }

    private LinearLayout row() {
        LinearLayout l = new LinearLayout(this);
        l.setOrientation(LinearLayout.HORIZONTAL);
        return l;
    }

    private Button button(String s) {
        Button b = new Button(this); b.setText(s); return b;
    }

    private LinearLayout.LayoutParams weight() {
        return new LinearLayout.LayoutParams(0, dp(52), 1);
    }

    private TextView log() {
        TextView t = new TextView(this);
        t.setTextSize(12);
        t.setTypeface(Typeface.MONOSPACE);
        t.setTextIsSelectable(true);
        t.setPadding(dp(8),dp(8),dp(8),dp(8));
        return t;
    }

    private void startServer() {
        int port = number(serverPort, 5201, 1, 65535);
        serverLog.setText("");
        Intent i = new Intent(this, IperfServerService.class);
        i.setAction(IperfServerService.ACTION_START);
        i.putExtra(IperfServerService.EXTRA_PORT, port);
        if (Build.VERSION.SDK_INT >= 26) startForegroundService(i); else startService(i);
    }

    private void stopServer() {
        Intent i = new Intent(this, IperfServerService.class);
        i.setAction(IperfServerService.ACTION_STOP);
        startService(i);
    }

    private void startClient() {
        stopClient();
        String h = host.getText().toString().trim();
        if (h.isEmpty()) { toast("请输入服务器 IP"); return; }
        int p = number(clientPort, 5201, 1, 65535);
        int t = number(duration, 10, 1, 3600);
        int n = number(parallel, 1, 1, 128);
        String bw = bandwidth.getText().toString().trim();
        if (bw.isEmpty()) bw = "0";

        List<String> a = new ArrayList<>();
        String exe = new File(getApplicationInfo().nativeLibraryDir, "libiperf3.so").getAbsolutePath();
        Collections.addAll(a, exe, "-c", h, "-p", String.valueOf(p),
                "-t", String.valueOf(t), "-P", String.valueOf(n), "--forceflush");
        if (reverse.isChecked()) a.add("-R");
        if (udp.isChecked()) { a.add("-u"); a.add("-b"); a.add(bw); }

        clientLog.setText("");
        ArrayList<String> show = new ArrayList<>(a); show.set(0, "iperf3");
        append(clientLog, "$ " + String.join(" ", show));

        new Thread(() -> {
            try {
                ProcessBuilder pb = new ProcessBuilder(a);
                pb.redirectErrorStream(true);
                clientProcess = pb.start();
                try (BufferedReader r = new BufferedReader(
                        new InputStreamReader(clientProcess.getInputStream()))) {
                    String line;
                    while ((line = r.readLine()) != null) append(clientLog, line);
                }
                int code = clientProcess.waitFor();
                append(clientLog, "进程结束，返回码 " + code);
            } catch (Exception e) {
                append(clientLog, "错误: " + e.getMessage());
            } finally { clientProcess = null; }
        }, "iperf3-client").start();
    }

    private void stopClient() {
        Process p = clientProcess;
        if (p != null) {
            try { p.destroy(); } catch (Exception ignored) {}
            clientProcess = null;
            if (clientLog != null) append(clientLog, "已停止。");
        }
    }

    private void append(TextView t, String s) {
        runOnUiThread(() -> t.append(s + "\n"));
    }

    private void refreshIp() {
        ArrayList<String> ips = new ArrayList<>();
        try {
            for (NetworkInterface ni : Collections.list(NetworkInterface.getNetworkInterfaces())) {
                if (!ni.isUp() || ni.isLoopback()) continue;
                for (InetAddress a : Collections.list(ni.getInetAddresses())) {
                    String s = a.getHostAddress();
                    if (!a.isLoopbackAddress() && s != null && s.indexOf(':') < 0) ips.add(s);
                }
            }
        } catch (Exception ignored) {}
        ipText.setText(ips.isEmpty() ? "本机 IPv4：未检测到" : "本机 IPv4：" + String.join(" / ", ips));
    }

    private int number(EditText e, int d, int min, int max) {
        try {
            int v = Integer.parseInt(e.getText().toString().trim());
            return Math.max(min, Math.min(max, v));
        } catch (Exception x) { return d; }
    }

    private void toast(String s) {
        Toast.makeText(this, s, Toast.LENGTH_SHORT).show();
    }

    private int dp(int n) {
        return (int)(n * getResources().getDisplayMetrics().density + 0.5f);
    }
}
