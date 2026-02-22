// Privacy Policy Worker - serves privacy-policy.html
export default {
  async fetch(request) {
    return new Response(HTML, {
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  },
};

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Mark Six Analysis: Bazi Version</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #C41E3A;
            border-bottom: 3px solid #FFD700;
            padding-bottom: 10px;
        }
        h2 {
            color: #C41E3A;
            margin-top: 30px;
        }
        .last-updated {
            color: #666;
            font-style: italic;
        }
        .disclaimer {
            background: #FFF3CD;
            border-left: 4px solid #FFA500;
            padding: 15px;
            margin-top: 30px;
        }
        .lang-switch {
            text-align: center;
            margin-bottom: 30px;
        }
        .lang-switch a {
            color: #C41E3A;
            text-decoration: none;
            margin: 0 10px;
            font-weight: bold;
        }
        .content {
            display: none;
        }
        .content.active {
            display: block;
        }
    </style>
</head>
<body>
    <div class="lang-switch">
        <a href="#" onclick="showLang('en'); return false;">English</a> | 
        <a href="#" onclick="showLang('zh'); return false;">繁體中文</a>
    </div>

    <div id="en-content" class="content active">
        <h1>Privacy Policy for Mark Six Analysis: Bazi Version</h1>
        <p class="last-updated"><strong>Last updated:</strong> February 22, 2026</p>

        <h2>Information We Collect</h2>
        <p>This app collects the following information locally on your device:</p>
        <ul>
            <li>Name (for personalized analysis)</li>
            <li>Birth date, time, and place (for Bazi calculations)</li>
            <li>Generated lucky number history</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
            <li>All data is stored <strong>locally on your device</strong> using AsyncStorage</li>
            <li>We <strong>do not upload</strong> your personal information to any servers</li>
            <li>Data is used solely to provide Bazi analysis and lucky number suggestions</li>
            <li>You can delete all data by clearing app data in your device settings</li>
        </ul>

        <h2>Third-Party Services</h2>
        <p>This app uses the following third-party services:</p>
        <ul>
            <li><strong>Google AdMob:</strong> For displaying advertisements. AdMob may collect device identifiers and usage data for ad personalization. See <a href="https://policies.google.com/privacy">Google's Privacy Policy</a>.</li>
            <li><strong>Apple App Store / Google Play Billing:</strong> For in-app subscriptions (subject to Apple/Google Privacy Policies)</li>
            <li><strong>Expo Services:</strong> For app updates and crash reporting (subject to Expo's Privacy Policy)</li>
        </ul>

        <h2>Advertising</h2>
        <p>This app displays ads through Google AdMob. AdMob may use device advertising identifiers to serve personalized ads. You can opt out of personalized advertising in your device settings. Premium subscribers enjoy an ad-free experience.</p>

        <h2>Data Security</h2>
        <p>Your data is stored locally on your device and is not transmitted to external servers. We do not have access to your personal information.</p>

        <h2>Children's Privacy</h2>
        <p>This app is not directed to children under 13. We do not knowingly collect information from children under 13.</p>

        <h2>Your Rights</h2>
        <p>You can:</p>
        <ul>
            <li>View all data stored in the app's history section</li>
            <li>Delete your data by clearing the app's data in device settings</li>
            <li>Uninstall the app to remove all stored data</li>
        </ul>

        <h2>Changes to This Policy</h2>
        <p>We may update this privacy policy from time to time. Changes will be posted in this document with an updated revision date.</p>

        <h2>Contact Us</h2>
        <p>If you have questions about this privacy policy, please contact us at:<br>
        <strong>support@tenetconcept.com</strong></p>

        <div class="disclaimer">
            <strong>Disclaimer:</strong> This app is for entertainment purposes only. We do not guarantee lottery wins and are not responsible for any gambling-related losses.
        </div>
    </div>

    <div id="zh-content" class="content">
        <h1>隱私政策 - 六合彩分析 八字版</h1>
        <p class="last-updated"><strong>最後更新：</strong>2026年2月22日</p>

        <h2>我們收集的資訊</h2>
        <p>本應用程式在您的裝置上本地收集以下資訊：</p>
        <ul>
            <li>姓名（用於個人化分析）</li>
            <li>出生日期、時間和地點（用於八字計算）</li>
            <li>生成的幸運號碼歷史記錄</li>
        </ul>

        <h2>如何使用您的資訊</h2>
        <ul>
            <li>所有資料均使用 AsyncStorage <strong>本地儲存</strong>在您的裝置上</li>
            <li>我們<strong>不會上傳</strong>您的個人資訊到任何伺服器</li>
            <li>資料僅用於提供八字分析和幸運號碼建議</li>
            <li>您可以透過清除應用程式資料來刪除所有資料</li>
        </ul>

        <h2>第三方服務</h2>
        <p>本應用程式使用以下第三方服務：</p>
        <ul>
            <li><strong>Google AdMob：</strong>用於顯示廣告。AdMob 可能會收集裝置識別碼和使用資料以進行廣告個人化。請參閱 <a href="https://policies.google.com/privacy">Google 隱私政策</a>。</li>
            <li><strong>Apple App Store / Google Play 付款：</strong>用於應用內訂閱（受 Apple/Google 隱私政策約束）</li>
            <li><strong>Expo 服務：</strong>用於應用程式更新和崩潰報告（受 Expo 隱私政策約束）</li>
        </ul>

        <h2>廣告</h2>
        <p>本應用程式透過 Google AdMob 顯示廣告。AdMob 可能會使用裝置廣告識別碼來提供個人化廣告。您可以在裝置設定中選擇退出個人化廣告。高級訂閱用戶可享受無廣告體驗。</p>

        <h2>資料安全</h2>
        <p>您的資料儲存在您的裝置本地，不會傳輸到外部伺服器。我們無法存取您的個人資訊。</p>

        <h2>兒童隱私</h2>
        <p>本應用程式不面向 13 歲以下兒童。我們不會故意收集 13 歲以下兒童的資訊。</p>

        <h2>您的權利</h2>
        <p>您可以：</p>
        <ul>
            <li>在應用程式的歷史記錄部分查看所有儲存的資料</li>
            <li>透過清除裝置設定中的應用程式資料來刪除您的資料</li>
            <li>解除安裝應用程式以移除所有儲存的資料</li>
        </ul>

        <h2>政策變更</h2>
        <p>我們可能會不時更新此隱私政策。變更將發布在本文件中，並註明更新日期。</p>

        <h2>聯絡我們</h2>
        <p>如對此隱私政策有任何疑問，請聯絡我們：<br>
        <strong>support@tenetconcept.com</strong></p>

        <div class="disclaimer">
            <strong>免責聲明：</strong>本應用程式僅供娛樂參考。我們不保證中獎，亦不對任何與賭博相關的損失負責。
        </div>
    </div>

    <script>
        function showLang(lang) {
            document.querySelectorAll('.content').forEach(el => el.classList.remove('active'));
            document.getElementById(lang + '-content').classList.add('active');
        }
    </script>
</body>
</html>`;
