package com.multipackagereactnative.ReactNative;

import android.support.v7.app.AppCompatActivity;
import android.view.KeyEvent;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.devsupport.DoubleTapReloadRecognizer;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.multipackagereactnative.BuildConfig;

public abstract class ReactAwareActivity extends AppCompatActivity implements ReactAwareActivityI, DefaultHardwareBackBtnHandler {
    private DoubleTapReloadRecognizer doubleTapReloadRecognizer = new DoubleTapReloadRecognizer();

    ReactNativeManager reactNativeManager = ReactNativeManager.sharedInstance;
    ReactInstanceManager reactInstanceManager = reactNativeManager.getReactInstanceManager();

    @Override
    protected void onPause() {
        reactInstanceManager.onHostPause(this);
        super.onPause();
    }

    @Override
    protected void onResume() {
        reactInstanceManager.onHostResume(this, this);
        super.onResume();
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        onBackPressed();
    }

    boolean isInitialized() {
        return reactNativeManager.isInitialized();
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (BuildConfig.DEBUG && keyCode == KeyEvent.KEYCODE_MENU) {
            reactInstanceManager.getDevSupportManager().showDevOptionsDialog();
            return true;
        }

        if (keyCode == 0) {
            reactInstanceManager.getDevSupportManager().showDevOptionsDialog();
            return true;
        }

        if (doubleTapReloadRecognizer.didDoubleTapR(keyCode, getCurrentFocus())) {
            reactInstanceManager.getDevSupportManager().handleReloadJS();
        }

        return super.onKeyUp(keyCode, event);
    }
}
