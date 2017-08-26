package com.solidmobile.kvikmyndr;

import android.widget.LinearLayout;
import android.graphics.Color;
import android.widget.ImageView;
import android.view.Gravity;
import android.util.TypedValue;

import com.reactnativenavigation.controllers.SplashActivity;

public class MainActivity extends SplashActivity {

    @Override
    public LinearLayout createSplashLayout() {
        LinearLayout view = new LinearLayout(this);
        ImageView logo = new ImageView(this);

        view.setBackgroundColor(Color.parseColor("#000000"));
        view.setGravity(Gravity.CENTER);

        logo.setImageResource(R.mipmap.splash);
        logo.setAdjustViewBounds(true);
        logo.setScaleType(ImageView.ScaleType.FIT_CENTER);
        logo.setMaxWidth(500);

        view.addView(logo);

        return view;
    }
}
