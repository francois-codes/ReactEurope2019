package com.multipackagereactnative.ReactNative;

import android.app.Application;
import android.content.Intent;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.widget.Toast;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;

public class ReactNativeManager {

    public static ReactNativeManager sharedInstance = new ReactNativeManager();

    private ReactInstanceManager reactInstanceManager;
    private boolean isInitialized = false;
    private static final int APP_INITIALIZE_TOAST_DELAY = 3000;

    private ReactNativeManager() {

    }

    public ReactInstanceManager getReactInstanceManager() {
        return reactInstanceManager;
    }

    public void injectReactInstanceManager(final ReactInstanceManager reactInstanceManager) {
        this.reactInstanceManager = reactInstanceManager;
        this.reactInstanceManager.addReactInstanceEventListener(
                new ReactInstanceManager.ReactInstanceEventListener() {
                    @Override
                    public void onReactContextInitialized(ReactContext context) {
                        reactInstanceManager.removeReactInstanceEventListener(this);
                        isInitialized = true;
                    }
                }
        );
    }

    boolean isInitialized() {
        return isInitialized;
    }

    public void start(final Application application) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(application)) {
            handleOverlayPermissionMissing(application);
            return;
        }
        reactInstanceManager.createReactContextInBackground();
    }

    private static void handleOverlayPermissionMissing(final Application application) {
        new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
            @Override
            public void run() {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                application.startActivity(intent);
                Toast.makeText(application, "This app must have overlay permissions", Toast.LENGTH_LONG).show();
            }
        }, APP_INITIALIZE_TOAST_DELAY);
    }
}
