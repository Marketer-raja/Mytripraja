# Connect the form to Google Sheets

1. Go to https://sheets.google.com and create a new sheet named "MyTripRaja Emails".
2. Click Extensions > Apps Script.
3. Delete the sample code, paste everything from Code.gs, and click Save.
4. Click Deploy > New deployment > gear icon > Web app.
   - Execute as: Me
   - Who has access: Anyone
5. Click Deploy, authorize access when asked, and copy the Web app URL (ends with /exec).
6. Open app.js and replace PASTE_YOUR_WEB_APP_URL_HERE with that URL.
7. Upload index.html, style.css and app.js to your hosting.
8. Test by submitting an email on the site. A new row appears in the "Emails" tab.

If you edit Code.gs later, use Deploy > Manage deployments > Edit > New version to publish changes.
Do not upload the google-sheets-setup folder to your website.
