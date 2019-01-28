package com.multipackagereactnative.ReactNative;

import android.support.v4.app.FragmentActivity;

import com.facebook.react.ReactRootView;

public interface ReactInterface {

    String getInstanceId();
    ReactRootView getReactRootView();
    boolean isDismissible();
    void signalFirstRenderComplete();
    FragmentActivity getActivity();
    void emitEvent(String eventName, Object object);
    void dismiss();
}
