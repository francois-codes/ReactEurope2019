package com.multipackagereactnative;

import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.BottomNavigationView;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentTransaction;
import android.support.v7.widget.Toolbar;
import android.view.MenuItem;
import android.widget.FrameLayout;
import android.widget.TextView;

import com.multipackagereactnative.ReactNative.ReactAwareActivity;
import com.multipackagereactnative.ReactNative.ReactNativePresenter;
import com.multipackagereactnative.ReactNative.Utils.BundleBuilder;

public class MainActivity extends ReactAwareActivity implements BlankFragment.OnFragmentInteractionListener {

    private final int OVERLAY_PERMISSION_REQ_CODE = 1;

    private String TAG = "MainActivity";

    private String GREEN_APP = "GreenApp";
    private String RED_APP = "RedApp";
    private String NATIVE_SCREEN = "Native Screen";

    private ReactNativePresenter reactNativePresenter;


    private BottomNavigationView.OnNavigationItemSelectedListener mOnNavigationItemSelectedListener
            = new BottomNavigationView.OnNavigationItemSelectedListener() {

        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item) {
            switch (item.getItemId()) {
                case R.id.navigation_home:
                    getSupportActionBar().setTitle(GREEN_APP);
                    reactNativePresenter.presentScreen(GREEN_APP, greenAppProps());

                    return true;
                case R.id.navigation_dashboard:
                    getSupportActionBar().setTitle(RED_APP);
                    reactNativePresenter.presentScreen(RED_APP, redAppProps());

                    return true;
                case R.id.navigation_notifications:
                    getSupportActionBar().setTitle(NATIVE_SCREEN);
                    presentNativeFragment();
                    return true;
            }
            return false;
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        toolbar.setTitleTextColor(Color.WHITE);
        getSupportActionBar().setTitle(GREEN_APP);

        FrameLayout container = findViewById(R.id.content);

        BottomNavigationView navigation = (BottomNavigationView) findViewById(R.id.navigation);
        navigation.setOnNavigationItemSelectedListener(mOnNavigationItemSelectedListener);

        reactNativePresenter = new ReactNativePresenter(this, container);
        reactNativePresenter.presentScreen("GreenApp", greenAppProps());

    }

    private Bundle redAppProps() {
        return new BundleBuilder()
                .putString("foo", "bar")
                .toBundle();
    }

    private Bundle greenAppProps() {
        return new BundleBuilder()
                .putInt("baz", 42)
                .toBundle();
    }

    private void presentNativeFragment() {
        BlankFragment frag = BlankFragment.newInstance("this is a native fragment with just a text view for now");
        FragmentManager fm = getSupportFragmentManager();
        FragmentTransaction ft = fm.beginTransaction();
        FrameLayout container = findViewById(R.id.content);
        Fragment currentFragment = fm.findFragmentById(container.getId());

        if (currentFragment != null) {
            ft.detach(currentFragment);
        }

        ft.add(container.getId(), frag).commit();
        fm.executePendingTransactions();

    }


    @Override
    public void onFragmentInteraction(Uri uri) {

    }
}
