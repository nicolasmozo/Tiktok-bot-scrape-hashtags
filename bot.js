const { TTScraper } = require("tiktok-scraper-ts"); 
const { GoogleSpreadsheet } = require('google-spreadsheet');
const TikTokScraper = new TTScraper();

const { google } = require('googleapis');
const { JWT } = require('google-auth-library');

const private_key = //generated after creating an app in Google Cloud
const client_email = //generated after creating an app in Google Cloud

const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

const jwtClient = new JWT({
  email: client_email,
  key: private_key,
  scopes: scopes,
});

const doc = new GoogleSpreadsheet('');
doc.useOAuth2Client(jwtClient);

const SPREADSHEET_ID = ''; # add ID google sheet
const SHEET_TITLE = 'tiktok bot'; # name of tab to paste 

async function accessSpreadsheet() {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

    // Authenticate with the Google Drive API using a service account
    await doc.useServiceAccountAuth({
        client_email: client_email,
        private_key: private_key,
    });

    const fetchVideo = await TikTokScraper.hashTag("colombia"); # tag to scrape
    
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['tiktok bot'];
    const rows = await sheet.getRows();
    const data = rows.map(row => ({description: row.description, createdAt: row.createdAt}));
    
    await sheet.setHeaderRow(['description', 'createdAt']); // Set headers in the sheet
    
    for (let i = 0; i < fetchVideo.length; i++) {
        const video = fetchVideo[i];
        const description = video.description;
        const createdAt = video.createdAt;
        console.log(description);

        const rowIdx = data.findIndex(row => row.description === description && row.createdAt === createdAt);
        console.log(rowIdx);
        if (rowIdx >= 0) {
            const row = rows[rowIdx];
            row.description = description;
            row.createdAt = createdAt;
            await row.save();
        } else {
        await sheet.addRow({description, createdAt});
        }
    }
}

accessSpreadsheet();

