package com.multipackagereactnative.ReactNative;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

public interface ReactAwareActivityI {
    Context getBaseContext();
    void startActivityForResult(Intent intent, int requestCode, Bundle bundle);
    void startActivityForResult(Intent intent, int requestCode);
    void setResult(int resultCode, Intent resultIntent);
    void finish();
}
