package com.multipackagereactnative.ReactNative;

import android.content.Context;
import android.util.AttributeSet;
import android.view.KeyEvent;
import android.widget.FrameLayout;

import android.support.annotation.Nullable;

import com.facebook.react.ReactRootView;

public class ReactNativeFragmentViewGroup extends FrameLayout {
    public interface KeyListener {
        boolean onKeyDown(int keyCode, KeyEvent keyEvent);
        boolean onKeyUp(int keyCode, KeyEvent keyEvent);
    }

    @Nullable private ReactRootView reactRootView;
    @Nullable private KeyListener keyListener;

    public ReactNativeFragmentViewGroup(Context context) {
        super(context);
    }

    public ReactNativeFragmentViewGroup(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public ReactNativeFragmentViewGroup(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    void setKeyListener(@Nullable KeyListener keyListener) {
        this.keyListener = keyListener;
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        boolean handled = super.onKeyDown(keyCode, event);

        if (!handled && keyListener != null) {
            handled = keyListener.onKeyDown(keyCode, event);
        }

        return handled;
    }

    void unmountReactApplicationAfterAnimation(ReactRootView reactRootView) {
        this.reactRootView = reactRootView;
    }

    @Override
    protected void onAnimationEnd() {
        super.onAnimationEnd();
        if (reactRootView != null) {
            reactRootView.unmountReactApplication();
            reactRootView = null;
        }
    }
}

