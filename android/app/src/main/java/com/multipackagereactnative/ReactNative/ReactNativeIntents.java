package com.multipackagereactnative.ReactNative;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;

public final class ReactNativeIntents {
    static final String REACT_MODULE_NAME = "REACT_MODULE_NAME";
    static final String REACT_PROPS = "REACT_PROPS";
    static final String IS_MODAL = "IS_MODAL";
    private static final String ON_DISAPPEAR = "onDisappear";
    private static final String ON_APPEAR = "onAppear";
    private static final String INSTANCE_ID_PROP = "nativeInstanceId";
    private static final String ON_BUTTON_PRESS = "onButtonPress";
    private static final String INITIAL_BAR_HEIGHT_PROP = "initialNavBarHeight";
    private static final String SHARED_ELEMENT_TRANSITION_GROUP_OPTION = "transitionGroup";

    private static ReactNativeManager reactNativeManager = ReactNativeManager.sharedInstance;

    private ReactNativeIntents() {

    }

    static Intent pushIntent(Context context, String moduleName, @Nullable Bundle props) {
        return new Intent(context, ReactNativeActivity.class).putExtras(intentExtras(moduleName, props));
    }

    static Intent presentIntent(Context context, String moduleName, @Nullable Bundle props) {
        return new Intent(context, ReactNativeActivity.class).putExtras(intentExtras(moduleName, props));
    }

    private static Bundle intentExtras(String moduleName, @Nullable Bundle props) {
        Bundle bundle = new Bundle();
        bundle.putString(REACT_MODULE_NAME, moduleName);
        bundle.putBundle(REACT_PROPS, props);

        return bundle;
    }

}
