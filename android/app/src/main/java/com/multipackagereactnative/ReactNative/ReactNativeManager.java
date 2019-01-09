package com.multipackagereactnative.ReactNative;

import android.app.Application;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactInstanceManagerBuilder;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;
import com.multipackagereactnative.BuildConfig;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import javax.annotation.Nullable;

public class ReactNativeManager implements DefaultHardwareBackBtnHandler, ReactInstanceManager.ReactInstanceEventListener {
    private final String TAG = getClass().getSimpleName();
    private static final String JS_BUNDLE_PATH = "main.jsbundle";

    private final ReactNativeActivity rootActivity;
    private final Application application;

    private Long lastRefreshTap = System.currentTimeMillis();

    private ReactNativeManager.Listener listener;
    private ReactInstanceManager reactInstanceManager;

    private ReactRootView reactRootView;

    public ReactRootView getReactRootView() {
        return reactRootView;
    }

    private final ReactNativeManager.ReactInfoProvider reactInfoProvider;

    private boolean initialized;

    public boolean isInitialized() {
        return initialized;
    }

    public ReactNativeManager(ReactNativeActivity rootActivity) {
        this.rootActivity = rootActivity;
        this.application = rootActivity.getApplication();
        this.reactInfoProvider = (ReactNativeManager.ReactInfoProvider) rootActivity;
    }

    public void onBackPressed() {
        if (reactInstanceManager != null) {
            reactInstanceManager.onBackPressed();
        } else {
            rootActivity.onBackPressed();
        }
    }

    public void onPause() {
        if (reactInstanceManager != null) reactInstanceManager.onHostPause(rootActivity);
    }

    public void onResume() {
        if (reactInstanceManager != null) reactInstanceManager.onHostResume(rootActivity, this);
    }

    public void onDestroy() {
        if (reactInstanceManager != null) reactInstanceManager.onHostDestroy(rootActivity);
        if (reactRootView != null) reactRootView.unmountReactApplication();
    }

    public boolean onKeyDownDebug(int keyCode) {
        if (reactInstanceManager == null)
            return false;

        switch (keyCode) {
            case KeyEvent.KEYCODE_MENU: {
                reactInstanceManager.showDevOptionsDialog();
                return true;
            }
            case KeyEvent.KEYCODE_R: {
                if (isDoubleTap()) {
                    reactInstanceManager.recreateReactContextInBackground();
                    return true;
                }
            }
            default: {
                return false;
            }
        }
    }

    private boolean isDoubleTap() {
        Long currentRefreshTap = System.currentTimeMillis();
        if ((currentRefreshTap - lastRefreshTap) < 250) {
            return true;
        }

        lastRefreshTap = currentRefreshTap;
        return false;
    }

    public void setListener(ReactNativeManager.Listener listener) {
        this.listener = listener;
    }

    public void start() {
        try {
            reactInstanceManager = getReactInstanceManager();
            reactInstanceManager.addReactInstanceEventListener(this);
            reactInstanceManager.createReactContextInBackground();
        } catch (Exception e) {
            if (listener != null) {
                listener.onError(e);
            }
        }
    }

    private ReactInstanceManager getReactInstanceManager() throws FileNotFoundException {
        return isUsingDevPackager()
                ? getInstanceManagerWithPackager()
                : getInstanceManagerWithBundle();
    }

    private boolean isUsingDevPackager() {
        return BuildConfig.DEBUG;
    }

    private ReactInstanceManager getInstanceManagerWithPackager() {
        return getReactNativeManagerBuilder()
                .setUseDeveloperSupport(true)
                .setBundleAssetName("index.android.bundle")
                .setJSMainModulePath("index")
                .build();
    }

    private ReactInstanceManager getInstanceManagerWithBundle() throws FileNotFoundException {
        if (!assetExists(JS_BUNDLE_PATH)) {
            throw new FileNotFoundException("bundle not found in path: assets://" + JS_BUNDLE_PATH);
        }

        return getReactNativeManagerBuilder()
                .setJSBundleFile("assets://" + JS_BUNDLE_PATH)
                .build();
    }

    private ReactInstanceManagerBuilder getReactNativeManagerBuilder() {
        return ReactInstanceManager.builder()
                .setApplication(application)
                .addPackage(new MainReactPackage())
                .setInitialLifecycleState(LifecycleState.BEFORE_RESUME);
    }

    @Override
    public void onReactContextInitialized(ReactContext context) {
        reactInstanceManager.removeReactInstanceEventListener(this);
        reactRootView = new ReactRootView(context);
        initialized = true;
        launchReactApplication();
    }

    public void launchReactApplication() {
        reactRootView.startReactApplication(
                reactInstanceManager,
                reactInfoProvider.reactModuleName(),
                reactInfoProvider.reactInitialProps()
        );

        listener.onShowReactNativeView();
    }

    public interface Listener {
        void onShowReactNativeView();
        void onError(@Nullable Exception e);
    }

    public interface ReactInfoProvider {
        String reactModuleName();
        Bundle reactInitialProps();
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        this.rootActivity.onBackPressed();
    }

    private boolean assetExists(String path) {
        boolean exists = false;
        try {
            InputStream stream = application.getAssets().open(path);
            stream.close();
            exists = true;
        } catch (FileNotFoundException e) {
            Log.e(TAG, "Asset in assets://" + path + "was not found", e);
        } catch (IOException e) {
            Log.e(TAG, "IO error in retrieving asset from assets://" + path, e);
        }

        return exists;
    }
}
