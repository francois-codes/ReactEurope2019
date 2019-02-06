package com.multipackagereactnative.ReactNative;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.app.AppCompatActivity;
import android.widget.FrameLayout;

public class ReactNativePresenter {

    private final AppCompatActivity activity;
    private final FrameLayout container;
    private ReactNativeManager reactNativeManager = ReactNativeManager.sharedInstance;

    public ReactNativePresenter(AppCompatActivity activity, FrameLayout container) {
        this.activity = activity;
        this.container = container;

    }

    public void presentScreen(String moduleName) {
        presentScreen(moduleName, null);
    }

    public void presentScreen(String moduleName, @Nullable Bundle props) {

        Fragment fragment = ReactNativeFragment.newInstance(moduleName, props);

        FragmentTransaction ft = activity.getSupportFragmentManager().beginTransaction();
        Fragment currentFragment = getCurrentFragment();
        if (currentFragment != null) {
            ft.detach(currentFragment);
        }

        ft.add(container.getId(), fragment).commit();
        activity.getSupportFragmentManager().executePendingTransactions();
    }

    @Nullable
    private Fragment getCurrentFragment() {
        return activity.getSupportFragmentManager().findFragmentById(container.getId());
    }
}
