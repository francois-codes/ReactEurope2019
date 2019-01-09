package com.multipackagereactnative;

import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.BottomNavigationView;
import android.view.MenuItem;
import android.widget.TextView;

import com.multipackagereactnative.ReactNative.ReactNativeActivity;
import com.multipackagereactnative.ReactNative.ReactNativeManager;

public class MainActivity extends ReactNativeActivity implements ReactNativeManager.ReactInfoProvider {

    private final int OVERLAY_PERMISSION_REQ_CODE = 1;

    private String TAG = "MainActivity";

    private TextView mTextMessage;

    private String reactModuleName = "GreenApp";

    private BottomNavigationView.OnNavigationItemSelectedListener mOnNavigationItemSelectedListener
            = new BottomNavigationView.OnNavigationItemSelectedListener() {

        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item) {
            switch (item.getItemId()) {
                case R.id.navigation_home:
                    mTextMessage.setText(R.string.title_home);
                    reactModuleName = "GreenApp";
                    return true;
                case R.id.navigation_dashboard:
                    mTextMessage.setText(R.string.title_dashboard);
                    reactModuleName = "RedApp";
                    return true;
                case R.id.navigation_notifications:
                    mTextMessage.setText(R.string.title_notifications);
                    return true;
            }
            return false;
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mTextMessage = (TextView) findViewById(R.id.message);
        BottomNavigationView navigation = (BottomNavigationView) findViewById(R.id.navigation);
        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);
    }

    @Override
    public String reactModuleName() {
        return reactModuleName;
    }

    @Override
    public Bundle reactInitialProps() {
        return getReactInitialProps();
    }

    private Bundle getReactInitialProps() {
        Bundle map = new Bundle();
        map.putString("foo", "bar");

        return map;
    }
}

//public class MainActivity extends ReactActivity {
//
//    /**
//     * Returns the name of the main component registered from JavaScript.
//     * This is used to schedule rendering of the component.
//     */
//    @Override
//    protected String getMainComponentName() {
//        return "MultiPackageReactNative";
//    }
//}
