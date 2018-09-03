package com.solidmobile.kvikmyndr;

import android.widget.LinearLayout;
import android.graphics.Color;
import android.widget.ImageView;
import android.view.Gravity;
import android.util.TypedValue;
import android.os.Bundle;
import android.support.annotation.Nullable;

import com.reactnativenavigation.NavigationActivity;

public class MainActivity extends NavigationActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        LinearLayout view = new LinearLayout(this);
        ImageView imageView = new ImageView(this);

        imageView.setImageDrawable(getDrawable(R.mipmap.ic_launcher));
        view.setBackgroundColor(Color.parseColor("#000000"));
        view.setGravity(Gravity.CENTER);
        view.addView(imageView);

        setContentView(view);
    }
}
