package com.multipackagereactnative.ReactNative.Utils;

import android.os.Bundle;
import android.os.Parcelable;

import java.io.Serializable;
import java.util.ArrayList;

@SuppressWarnings("unchecked")
public abstract class ExtendableBundleBuilder<T extends  ExtendableBundleBuilder<?>> {

    private final Bundle bundle = new Bundle();

    protected ExtendableBundleBuilder() {}

    public T putBoolean(String key, boolean value) {
        bundle.putBoolean(key, value);
        return (T) this;
    }

    public T putByte(String key, byte value) {
        bundle.putByte(key, value);
        return (T) this;
    }

    public T putChar(String key, char value) {
        bundle.putChar(key, value);
        return (T) this;
    }

    public T putShort(String key, short value) {
        bundle.putShort(key, value);
        return (T) this;
    }

    public T putInt(String key, int value) {
        bundle.putInt(key, value);
        return (T) this;
    }

    public T putBundle(String key, Bundle value) {
        bundle.putBundle(key, value);
        return (T) this;
    }

    public T putLong(String key, long value) {
        bundle.putLong(key, value);
        return (T) this;
    }

    public T putFloat(String key, float value) {
        bundle.putFloat(key, value);
        return (T) this;
    }

    public T putDouble(String key, double value) {
        bundle.putDouble(key, value);
        return (T) this;
    }

    public T putString(String key, String value) {
        bundle.putString(key, value);
        return (T) this;
    }

    public T putIntArray(String key, int[] value) {
        bundle.putIntArray(key, value);
        return (T) this;
    }

    public T putStringArray(String key, String[] value) {
        bundle.putStringArray(key, value);
        return (T) this;
    }

    public T putStringArrayList(String key, ArrayList<String> array) {
        bundle.putStringArrayList(key, array);
        return (T) this;
    }

    public T putParcelable(String key, Parcelable value) {
        bundle.putParcelable(key, value);
        return (T) this;
    }

    public T putParcelableArrayList(String key, ArrayList<? extends Parcelable> value) {
        bundle.putParcelableArrayList(key, value);
        return (T) this;
    }

    public T putAll(Bundle bundle) {
        this.bundle.putAll(bundle);
        return (T) this;
    }

    public T putSerializable(String key, Serializable value) {
        bundle.putSerializable(key, value);
        return (T) this;
    }


    // exports to bundle
    public Bundle toBundle() {
        return new Bundle(bundle);
    }
}
