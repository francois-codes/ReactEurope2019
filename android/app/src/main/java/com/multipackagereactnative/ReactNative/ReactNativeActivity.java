package com.multipackagereactnative.ReactNative;

import android.annotation.TargetApi;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.provider.Settings;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.KeyEvent;

import com.multipackagereactnative.BuildConfig;

import javax.annotation.Nullable;

public class ReactNativeActivity extends AppCompatActivity {
    private static final int OVERLAY_PERMISSION_REQ_CODE = 1;
    private static final String TAG = "ReactNativeActivity";

    private ReactNativeManager reactNativeManager;

    @Override
    protected void onCreate(Bundle saveInstanceState) {
        super.onCreate(saveInstanceState);
        if (shouldAskForOverlayPermissions()) {
            askOverlayPermissions();
            return;
        }

        startReactNative();
    }

    private boolean shouldAskForOverlayPermissions() {
        return BuildConfig.DEBUG
                && (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (BuildConfig.DEBUG) onActivityResultDebugFlavor(requestCode);
    }

    private void onActivityResultDebugFlavor(int requestCode) {
        if (requestCode != OVERLAY_PERMISSION_REQ_CODE) return;

        if (drawOverlayPermissionGranted()) {
            startReactNative();
        } else {
            Log.d(TAG, "overlay permissions are required");
            finish();
        }
    }

    @TargetApi(Build.VERSION_CODES.M)
    private void askOverlayPermissions() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if(!drawOverlayPermissionGranted()) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:"+getPackageName()));
                startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
            }
        }
    }

    @TargetApi(Build.VERSION_CODES.M)
    private boolean drawOverlayPermissionGranted() {
        return Settings.canDrawOverlays(this);
    }

    private void startReactNative() {
        reactNativeManager = new ReactNativeManager(this);
        reactNativeManager.setListener(new ReactNativeManager.Listener() {
            @Override
            public void onShowReactNativeView() {
                reactNativeManager.onResume();
                setContentView(reactNativeManager.getReactRootView());
            }

            @Override
            public void onError(@Nullable Exception e) {
                Log.e(TAG, "React Native Manager error", e);
                Handler handler = new Handler();
                handler.postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        finish();
                    }
                }, 1000);

            }
        });
        reactNativeManager.start();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent keyEvent) {
        if (BuildConfig.DEBUG) return onKeyDownDebugFlavor(keyCode, keyEvent);
        return super.onKeyDown(keyCode, keyEvent);
    }

    @Override
    public void onBackPressed() {
        if ((reactNativeManager != null) && (reactNativeManager.isInitialized())) {
            reactNativeManager.onBackPressed();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (reactNativeManager != null) reactNativeManager.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (reactNativeManager != null) reactNativeManager.onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (reactNativeManager != null) reactNativeManager.onDestroy();
    }

    private boolean onKeyDownDebugFlavor(int keyCode, KeyEvent event) {
        boolean shouldOverrideKeyDownEvent = false;
        if (reactNativeManager != null) {
            shouldOverrideKeyDownEvent = reactNativeManager.onKeyDownDebug(keyCode);
        }

        return shouldOverrideKeyDownEvent || super.onKeyDown(keyCode, event);
    }
}
