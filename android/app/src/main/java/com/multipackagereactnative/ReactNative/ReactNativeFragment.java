package com.multipackagereactnative.ReactNative;


import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewStub;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.devsupport.DoubleTapReloadRecognizer;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.core.PermissionListener;
import com.multipackagereactnative.BuildConfig;
import com.multipackagereactnative.R;

import java.util.Locale;


public class ReactNativeFragment extends Fragment implements ReactInterface, ReactNativeFragmentViewGroup.KeyListener {
    private static final String TAG = ReactNativeFragment.class.getSimpleName();

    private DoubleTapReloadRecognizer doubleTapReloadRecognizer = new DoubleTapReloadRecognizer();

    static final String IS_MODAL = "IS_MODAL";
    private static final String ON_DISAPPEAR = "onDisappear";
    private static final String ON_APPEAR = "onAppear";
    private static final String INSTANCE_ID_PROP = "nativeInstanceId";
    private static final String ON_BUTTON_PRESS = "onButtonPress";
    private static final String INITIAL_BAR_HEIGHT_PROP = "initialNavBarHeight";
    private static final int RENDER_TIMOUT = 1700;

    private static int UUID = 1;

    private ReactNativeManager reactNativeManager = ReactNativeManager.sharedInstance;
    private ReactInstanceManager reactInstanceManager = reactNativeManager.getReactInstanceManager();

    private final Runnable timeoutCallback = new Runnable() {
        @Override
        public void run() {
            Log.d(TAG, "render timeout callback called");
            signalFirstRenderComplete();
        }
    };

    private String instanceId;
    private boolean isWaitingForRenderToFinish = false;
    private ReactNativeFragmentViewGroup contentContainer;
    private ReactRootView reactRootView;
    private final Handler handler = new Handler();
    private PermissionListener permissionListener;
    private AppCompatActivity activity;
    private View loadingView;

    static ReactNativeFragment newInstance(String moduleName, @Nullable Bundle props) {
        ReactNativeFragment frag = new ReactNativeFragment();
        Bundle args = new Bundle();
        args.putString(ReactNativeIntents.REACT_MODULE_NAME, moduleName);
        args.putBundle(ReactNativeIntents.REACT_PROPS, props);

        frag.setArguments(args);
        return frag;
    }

    static ReactNativeFragment newInstance(Bundle intentExtras) {
        ReactNativeFragment frag = new ReactNativeFragment();
        frag.setArguments(intentExtras);
        return frag;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (instanceId == null) {
            if (savedInstanceState == null) {
                String moduleName = getArguments().getString(ReactNativeIntents.REACT_MODULE_NAME);
                instanceId = String.format(Locale.ENGLISH, "%1s_fragment_%2$d", moduleName, UUID++);
            } else {
                instanceId = savedInstanceState.getString(INSTANCE_ID_PROP);
            }
        }

        setHasOptionsMenu(true);
        Log.d(TAG, "onCreate");
    }

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        Log.d(TAG, "onActivityCreated");
        initReactNative();
    }

    private void initReactNative() {

        if (reactRootView != null || getView() == null) {
            Log.d(TAG, "init react native - view is null");
            return;
        }

        if (!isInitialized()) {
            reactInstanceManager.addReactInstanceEventListener(
                new ReactInstanceManager.ReactInstanceEventListener() {
                    @Override
                    public void onReactContextInitialized(ReactContext context) {
                        reactInstanceManager.removeReactInstanceEventListener(this);
                        handler.post(new Runnable() {
                            @Override
                            public void run() {
                                onAttachWithReactContext();
                            }
                        });
                    }
                }
            );
        } else {
            onAttachWithReactContext();

            isWaitingForRenderToFinish = true;
            handler.postDelayed(new Runnable() {
                @Override
                public void run() {
                    Log.d(TAG, "render timeout callback called");
                    startPostponedEnterTransition();
                }
            }, RENDER_TIMOUT);
        }

        // register react component ?

    }

    private void onAttachWithReactContext() {
        Log.d(TAG, "onCreateWithReactContext");
        if (getView() == null) {
            return;
        }
//        loadingView.setVisibility(View.GONE);

        if (!isInitialized()) {
            Log.d(TAG, "on attach - react not initialized");
            return;
        }

        String moduleName = getArguments().getString(ReactNativeIntents.REACT_MODULE_NAME);
        Bundle props = getArguments().getBundle(ReactNativeIntents.REACT_PROPS);
        if (props == null) {
            props = new Bundle();
        }

        props.putString(INSTANCE_ID_PROP, instanceId);

        if (reactRootView == null) {
            ViewStub reactViewStub = (ViewStub) getView().findViewById(R.id.react_root_view_stub);
            reactRootView = (ReactRootView) reactViewStub.inflate();
        }

        reactRootView.startReactApplication(reactInstanceManager, moduleName, props);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        postponeEnterTransition();
        View v = inflater.inflate(R.layout.fragment_react_native, container, false);
        contentContainer = v.findViewById(R.id.content_container);
        contentContainer.setKeyListener(this);
        activity = (AppCompatActivity) getActivity();

        String moduleName = getArguments().getString(ReactNativeIntents.REACT_MODULE_NAME);
        Log.d(TAG, "onCreateView " + moduleName);

        return v;
    }

    @Override
    public void postponeEnterTransition() {
        super.postponeEnterTransition();
        Log.d(TAG, "postponeEnterTransition");
        getActivity().supportPostponeEnterTransition();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onSaveInstanceState(@NonNull Bundle outState) {
        outState.putString(INSTANCE_ID_PROP, instanceId);
    }

    @Override
    public void onPause() {
        super.onPause();
        emitEvent(ON_DISAPPEAR, null);
    }

    @Override
    public void onResume() {
        super.onResume();
        emitEvent(ON_APPEAR, null);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();

    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent keyEvent) {
        return false;
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent keyEvent) {
        if (BuildConfig.DEBUG && keyCode == KeyEvent.KEYCODE_MENU) {
            reactInstanceManager.getDevSupportManager().showDevOptionsDialog();
            return true;
        }

        if (doubleTapReloadRecognizer.didDoubleTapR(keyCode, activity.getCurrentFocus())) {
            reactInstanceManager.getDevSupportManager().handleReloadJS();
            return true;
        }

        return false;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        if (permissionListener != null && permissionListener.onRequestPermissionsResult(requestCode, permissions, grantResults)) {
            permissionListener = null;
        }
    }

    public void dismiss() {
        Intent intent = new Intent().putExtra("DISMISS", isDismissible());
        getActivity().setResult(Activity.RESULT_OK, intent);
        getActivity().finish();
    }

    @Override
    public String getInstanceId() {
        return instanceId;
    }

    @Override
    public ReactRootView getReactRootView() {
        return reactRootView;
    }

    @Override
    public boolean isDismissible() {
        return false;
    }

    @Override
    public void signalFirstRenderComplete() {
        Log.d(TAG, "signalFirstRenderComplete");
        startPostponedEnterTransition();
    }

    private boolean isInitialized() {
        return reactNativeManager.isInitialized();
    }

    public void emitEvent(String eventName, Object object) {
        if (isInitialized()) {
            String key = String.format(Locale.ENGLISH, "NativeScreen.%s.%s", eventName, instanceId);

            ReactContext context = reactInstanceManager.getCurrentReactContext();

            if (context == null) {
                Log.d(TAG, "emit event - react context is null");
                throw new IllegalArgumentException("react context is null");
            }

            if (context.hasActiveCatalystInstance()) {
                try {
                    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(key, object);
                } catch (RuntimeException e) {
                    Log.e(TAG, "oups", e);
                }
            }
        }
    }
}