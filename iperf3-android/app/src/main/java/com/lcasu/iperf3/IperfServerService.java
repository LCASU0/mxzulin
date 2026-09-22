package com.lcasu.iperf3;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;

public class IperfServerService extends Service {
    public static final String ACTION_START = "com.lcasu.iperf3.START_SERVER";
    public static final String ACTION_STOP = "com.lcasu.iperf3.STOP_SERVER";
    public static final String ACTION_LOG = "com.lcasu.iperf3.SERVER_LOG";
    public static final String EXTRA_PORT = "port";
    public static final String EXTRA_LINE = "line";
    public static final String EXTRA_RUNNING = "running";

    private static final String CHANNEL_ID = "iperf3_server";
    private static final int NOTIFY_ID = 5201;
    private volatile Process process;
    private volatile boolean stopping;

    @Override public void onCreate() {
        super.onCreate();
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel c = new NotificationChannel(
                    CHANNEL_ID, "iPerf3 服务端", NotificationManager.IMPORTANCE_LOW);
            c.setDescription("保持 iPerf3 服务端运行");
            ((NotificationManager)getSystemService(Context.NOTIFICATION_SERVICE))
                    .createNotificationChannel(c);
        }
    }

    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent == null ? null : intent.getAction();
        if (ACTION_STOP.equals(action)) {
            stopIperf();
            stopForeground(true);
            stopSelf();
            return START_NOT_STICKY;
        }

        int port = intent == null ? 5201 : intent.getIntExtra(EXTRA_PORT, 5201);
        startForeground(NOTIFY_ID, makeNotification(port));
        startIperf(port);
        return START_STICKY;
    }

    private Notification makeNotification(int port) {
        Intent open = new Intent(this, MainActivity.class);
        PendingIntent pi = PendingIntent.getActivity(
                this, 1, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        return new Notification.Builder(this, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.stat_sys_upload_done)
                .setContentTitle("iPerf3 服务端运行中")
                .setContentText("监听端口 " + port)
                .setOngoing(true)
                .setContentIntent(pi)
                .build();
    }

    private synchronized void startIperf(final int port) {
        if (process != null && process.isAlive()) {
            send("服务端已在运行。", true);
            return;
        }
        stopping = false;
        new Thread(() -> {
            try {
                String exe = new File(getApplicationInfo().nativeLibraryDir, "libiperf3.so").getAbsolutePath();
                send("$ iperf3 -s -p " + port, true);
                ProcessBuilder pb = new ProcessBuilder(exe, "-s", "-p",
                        String.valueOf(port), "--forceflush");
                pb.redirectErrorStream(true);
                process = pb.start();

                try (BufferedReader r = new BufferedReader(
                        new InputStreamReader(process.getInputStream()))) {
                    String line;
                    while ((line = r.readLine()) != null) send(line, true);
                }

                int code = process.waitFor();
                if (!stopping) send("服务端退出，返回码 " + code, false);
            } catch (Exception e) {
                if (!stopping) send("服务端错误: " + e.getMessage(), false);
            } finally {
                process = null;
                if (!stopping) {
                    stopForeground(true);
                    stopSelf();
                }
            }
        }, "iperf3-server").start();
    }

    private synchronized void stopIperf() {
        stopping = true;
        if (process != null) {
            try { process.destroy(); } catch (Exception ignored) {}
            process = null;
        }
        send("服务端已停止。", false);
    }

    private void send(String line, boolean running) {
        Intent i = new Intent(ACTION_LOG);
        i.setPackage(getPackageName());
        i.putExtra(EXTRA_LINE, line);
        i.putExtra(EXTRA_RUNNING, running);
        sendBroadcast(i);
    }

    @Override public void onDestroy() {
        stopIperf();
        super.onDestroy();
    }

    @Override public IBinder onBind(Intent intent) { return null; }
}
