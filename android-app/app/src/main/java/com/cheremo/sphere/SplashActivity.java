package com.cheremo.sphere;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.animation.AlphaAnimation;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

@SuppressLint("CustomSplashScreen")
public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        ImageView logo = findViewById(R.id.splash_logo);
        TextView tagline = findViewById(R.id.splash_tagline);
        TextView title = findViewById(R.id.splash_title);

        // Fade in logo animation
        AlphaAnimation fadeInLogo = new AlphaAnimation(0.0f, 1.0f);
        fadeInLogo.setDuration(700);
        fadeInLogo.setFillAfter(true);
        if (logo != null) logo.startAnimation(fadeInLogo);

        // Fade in text animation
        AlphaAnimation fadeInText = new AlphaAnimation(0.0f, 1.0f);
        fadeInText.setDuration(900);
        fadeInText.setStartOffset(350);
        fadeInText.setFillAfter(true);
        if (title != null) title.startAnimation(fadeInText);
        if (tagline != null) tagline.startAnimation(fadeInText);

        // Navigate to MainActivity after 2.0 seconds
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            Intent intent = new Intent(SplashActivity.this, MainActivity.class);
            startActivity(intent);
            finish();
        }, 2000);
    }
}
