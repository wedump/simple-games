package com.wedump.simple_games;

import java.io.File;

import android.app.Activity;
import android.content.ClipData;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.ConsoleMessage;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class SimpleActivity extends Activity {

	private WebView simpleWebView;
	private ValueCallback<Uri> uploadMessage;
	private final static int FILECHOOSER_RESULTCODE = 1;
	
	private class WishWebViewClient extends WebViewClient {		
		@Override
		public boolean shouldOverrideUrlLoading(WebView view, String url) {
			view.loadUrl(url);
			return true;
		}
	}
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_simple);
		
		simpleWebView = (WebView) findViewById(R.id.simpleWebView);
		simpleWebView.getSettings().setJavaScriptEnabled(true);
		simpleWebView.setWebViewClient(new WishWebViewClient());
		simpleWebView.setWebChromeClient(new WebChromeClient() {
			@Override
			public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
				Log.e("SIMPLE_LOG", consoleMessage.message() + '\n' + consoleMessage.messageLevel() + '\n' + consoleMessage.sourceId());
				return super.onConsoleMessage(consoleMessage);
			}
			
			@SuppressWarnings("unused")
			public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
				uploadMessage = uploadMsg;
				
				Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
				intent.addCategory(Intent.CATEGORY_OPENABLE);
				// intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
				intent.setType("image/*");
				
				SimpleActivity.this.startActivityForResult(Intent.createChooser(intent, "File Chooser"), FILECHOOSER_RESULTCODE);
			}
		});
		simpleWebView.loadUrl("http://192.168.123.109:8000/");
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.simple, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle action bar item clicks here. The action bar will
		// automatically handle clicks on the Home/Up button, so long
		// as you specify a parent activity in AndroidManifest.xml.
		int id = item.getItemId();
		if (id == R.id.action_settings) {
			return true;
		}
		return super.onOptionsItemSelected(item);
	}
	
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if ((keyCode == KeyEvent.KEYCODE_BACK) && simpleWebView.canGoBack()) {
			simpleWebView.goBack();
			return true;
		}
		
		return super.onKeyDown(keyCode, event);
	}
	
	@Override
	protected  void onActivityResult(int requestCode, int resultCode, Intent intent) {
		if (requestCode == FILECHOOSER_RESULTCODE) {
			if (null == uploadMessage)
				return;
			
			Uri result = intent == null || resultCode != RESULT_OK ? null : intent.getData();
			
			if (result != null) {
				Cursor c = getContentResolver().query(result, null, null, null, null);			
				c.moveToNext();
				
				String path = c.getString(c.getColumnIndex(MediaStore.MediaColumns.DATA));
				
				uploadMessage.onReceiveValue(Uri.fromFile(new File(path)));
				c.close();
			}
//			else {
//				ClipData clipData = intent.getClipData();
//				Uri[] results = new Uri[clipData.getItemCount()];
//				
//				for (int i = 0; i < clipData.getItemCount(); i++) {
//					Cursor c = getContentResolver().query(clipData.getItemAt(i).getUri(), null, null, null, null);
//					c.moveToNext();
//					
//					String path = c.getString(c.getColumnIndex(MediaStore.MediaColumns.DATA));
//					results[i] = Uri.fromFile(new File(path));
//					
//					c.close();
//				}
//				
//				uploadMessage.onReceiveValue(results);
//			}
			
			uploadMessage = null;
		}
	}

}