package com.multipackagereactnative.ReactNative;

import android.os.Bundle;
import android.os.Handler;
import android.os.PersistableBundle;
import android.support.annotation.Nullable;
import android.util.Log;

import com.multipackagereactnative.R;

public class ReactNativeActivity extends ReactAwareActivity {
    private static final String TAG = ReactNativeActivity.class.getSimpleName();

    private final Handler handler = new Handler();
    private ReactNativeManager reactNativeManager = ReactNativeManager.sharedInstance;

    private ReactNativeFragment fragment;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d(TAG, "create React Activity");

        String moduleName = getIntent().getStringExtra(ReactNativeIntents.REACT_MODULE_NAME);

        setContentView(R.layout.react_activity);

        fragment = ReactNativeFragment.newInstance(getIntent().getExtras());

        getSupportFragmentManager().beginTransaction()
                .add(R.id.content, fragment)
                .commitNow();

        getSupportFragmentManager().executePendingTransactions();
        supportPostponeEnterTransition();
    }

}