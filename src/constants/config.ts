// Birth places with their codes and timezone offsets
export const BIRTH_PLACES = [
  { code: 'hongKong', labelKey: 'places.hongKong', timezone: 'Asia/Hong_Kong', offset: 8 },
  { code: 'macau', labelKey: 'places.macau', timezone: 'Asia/Macau', offset: 8 },
  { code: 'china', labelKey: 'places.china', timezone: 'Asia/Shanghai', offset: 8 },
  { code: 'philippines', labelKey: 'places.philippines', timezone: 'Asia/Manila', offset: 8 },
  { code: 'indonesia', labelKey: 'places.indonesia', timezone: 'Asia/Jakarta', offset: 7 },
  { code: 'india', labelKey: 'places.india', timezone: 'Asia/Kolkata', offset: 5.5 },
  { code: 'uk', labelKey: 'places.uk', timezone: 'Europe/London', offset: 0 },
  { code: 'usa', labelKey: 'places.usa', timezone: 'America/New_York', offset: -5 },
  { code: 'australia', labelKey: 'places.australia', timezone: 'Australia/Sydney', offset: 10 },
  { code: 'thailand', labelKey: 'places.thailand', timezone: 'Asia/Bangkok', offset: 7 },
  { code: 'malaysia', labelKey: 'places.malaysia', timezone: 'Asia/Kuala_Lumpur', offset: 8 },
  { code: 'singapore', labelKey: 'places.singapore', timezone: 'Asia/Singapore', offset: 8 },
  { code: 'japan', labelKey: 'places.japan', timezone: 'Asia/Tokyo', offset: 9 },
  { code: 'korea', labelKey: 'places.korea', timezone: 'Asia/Seoul', offset: 9 },
  { code: 'taiwan', labelKey: 'places.taiwan', timezone: 'Asia/Taipei', offset: 8 },
  { code: 'europe', labelKey: 'places.europe', timezone: 'Europe/Paris', offset: 1 },
  { code: 'middleEast', labelKey: 'places.middleEast', timezone: 'Asia/Dubai', offset: 4 },
  { code: 'vietnam', labelKey: 'places.vietnam', timezone: 'Asia/Ho_Chi_Minh', offset: 7 },
  { code: 'africa', labelKey: 'places.africa', timezone: 'Africa/Johannesburg', offset: 2 },
];

// Time periods for birth time selection (24-hour format)
export const TIME_PERIODS = [
  { label: '子時 (23:00-01:00)', start: 23, end: 1, period: '子' },
  { label: '丑時 (01:00-03:00)', start: 1, end: 3, period: '丑' },
  { label: '寅時 (03:00-05:00)', start: 3, end: 5, period: '寅' },
  { label: '卯時 (05:00-07:00)', start: 5, end: 7, period: '卯' },
  { label: '辰時 (07:00-09:00)', start: 7, end: 9, period: '辰' },
  { label: '巳時 (09:00-11:00)', start: 9, end: 11, period: '巳' },
  { label: '午時 (11:00-13:00)', start: 11, end: 13, period: '午' },
  { label: '未時 (13:00-15:00)', start: 13, end: 15, period: '未' },
  { label: '申時 (15:00-17:00)', start: 15, end: 17, period: '申' },
  { label: '酉時 (17:00-19:00)', start: 17, end: 19, period: '酉' },
  { label: '戌時 (19:00-21:00)', start: 19, end: 21, period: '戌' },
  { label: '亥時 (21:00-23:00)', start: 21, end: 23, period: '亥' },
];

// Suggested purchase locations - Hong Kong Jockey Club betting branches with real addresses
// Structure: { name: 'Chinese 中文 English', nameZh: '繁體中文', nameEn: 'English', address: 'Chinese Address', addressEn: 'English Address', lat, lng, direction: '東'|'南'|'西'|'北'|'中' }
export const PURCHASE_LOCATIONS = [
  // 中西區 Central & Western (中央)
  { name: '中環士丹利街 Central Stanley Street', nameZh: '中環士丹利街', nameEn: 'Central, Stanley Street', address: '士丹利街10-12號地下至三樓2號舖', addressEn: 'Shop 2, UG-3/F, 10-12 Stanley Street', lat: 22.2813, lng: 114.1548, direction: '中' },
  { name: '上環干諾道西 Sheung Wan Connaught Road West', nameZh: '上環干諾道西', nameEn: 'Sheung Wan, Connaught Road West', address: '干諾道西3號億利商業大廈地下D-F及G1舖', addressEn: 'Shop D-F and G1, G/F, Yardley Commercial Building, 3 Connaught Road West', lat: 22.2873, lng: 114.1465, direction: '中' },
  { name: '西區卑路乍街 Western Belcher\'s Street', nameZh: '西區卑路乍街', nameEn: 'Western, Belcher\'s Street', address: '卑路乍街35號A翡翠閣地下7A及8-17號舖', addressEn: 'Shops 7A & 8-17, G/F, Jade Court, 35A Belcher\'s Street', lat: 22.2871, lng: 114.1372, direction: '西' },
  { name: '西區德輔道西 Western Des Voeux Road West', nameZh: '西區德輔道西', nameEn: 'Western, Des Voeux Road West', address: '干諾道西118號地下6-8號舖', addressEn: 'Shop 6-8, G/F, 118 Connaught Road West', lat: 22.2873, lng: 114.1398, direction: '西' },
  { name: '西區屈地街 Western Whitty Street', nameZh: '西區屈地街', nameEn: 'Western, Whitty Street', address: '屈地街3-7號光前大廈地下4號舖', addressEn: 'Shop 4, G/F, Kong Chian Tower, 3-7 Whitty Street', lat: 22.2868, lng: 114.1385, direction: '西' },
  
  // 東區 Eastern
  { name: '柴灣常安街 Chai Wan Sheung On Street', nameZh: '柴灣常安街', nameEn: 'Chai Wan, Sheung On Street', address: '常安街77號發達中心地下至3樓', addressEn: 'G/F-3/F Federal Centre, 77 Sheung On Street', lat: 22.2638, lng: 114.2367, direction: '東' },
  { name: '北角電氣道 North Point Electric Road', nameZh: '北角電氣道', nameEn: 'North Point, Electric Road', address: '電氣道276-280號華凱大廈地下及1樓', addressEn: 'G-1/F, Wah Hoi Building, 276-280 Electric Road', lat: 22.2905, lng: 114.2006, direction: '東' },
  { name: '北角馬寶道 North Point Marble Road', nameZh: '北角馬寶道', nameEn: 'North Point, Marble Road', address: '馬寶道76號華禮大廈地下', addressEn: 'G/F, Wah Lai Mansion, 76 Marble Road', lat: 22.2919, lng: 114.1988, direction: '東' },
  { name: '鰂魚涌英皇道 Quarry Bay King\'s Road', nameZh: '鰂魚涌英皇道', nameEn: 'Quarry Bay, King\'s Road', address: '英皇道989號新威園地下及2樓A2舖', addressEn: 'Shop A2, G/F and 2/F, Sunway Garden, 989 King\'s Road', lat: 22.2879, lng: 114.2146, direction: '東' },
  { name: '筲箕灣寶文街 Shau Kei Wan Po Man Street', nameZh: '筲箕灣寶文街', nameEn: 'Shau Kei Wan, Po Man Street', address: '寶文街2號海峰中心地舖5-6號及1樓', addressEn: 'Shops 5-6, G/F and Shop 6A, 1/F, Hoi Fung Centre, 2 Po Man Street', lat: 22.2798, lng: 114.2264, direction: '東' },
  { name: '筲箕灣道 Shau Kei Wan Road', nameZh: '筲箕灣道', nameEn: 'Shau Kei Wan Road', address: '筲箕灣道334-338號華寶大廈地下', addressEn: 'G/F, Wah Po Building, 334-338 Shau Kei Wan Road', lat: 22.2799, lng: 114.2251, direction: '東' },
  
  // 南區 Southern
  { name: '香港仔田灣 Aberdeen Tin Wan', nameZh: '香港仔田灣', nameEn: 'Aberdeen, Tin Wan', address: '田灣石排灣道56-62號仁勝大廈地下', addressEn: 'LG/F, Yen Shing Mansion, 56-62 Shek Pai Wan Road', lat: 22.2479, lng: 114.1531, direction: '南' },
  
  // 灣仔區 Wan Chai
  { name: '銅鑼灣謝斐道 Causeway Bay Jaffe Road', nameZh: '銅鑼灣謝斐道', nameEn: 'Causeway Bay, Jaffe Road', address: '謝斐道501-515號美漢大廈地下及1樓', addressEn: 'G-1/F, Malahon Apartments, 501-515, Jaffe Road', lat: 22.2809, lng: 114.1825, direction: '中' },
  { name: '銅鑼灣波斯富街 Causeway Bay Percival Street', nameZh: '銅鑼灣波斯富街', nameEn: 'Causeway Bay, Percival Street', address: '波斯富街78-82號麗園大廈地下及1樓', addressEn: 'G-1/F, Lai Yuen Apartments, 78-82 Percival Street', lat: 22.2802, lng: 114.1845, direction: '中' },
  { name: '跑馬地藍塘道 Happy Valley Blue Pool Road', nameZh: '跑馬地藍塘道', nameEn: 'Happy Valley, Blue Pool Road', address: '藍塘道12-22號友誼大廈地下', addressEn: 'G/F, Sub-Division 3, Friendship Court, 12-22 Blue Pool Road', lat: 22.2698, lng: 114.1829, direction: '中' },
  { name: '灣仔軒尼詩道 Wan Chai Hennessy Road', nameZh: '灣仔軒尼詩道', nameEn: 'Wan Chai, Hennessy Road', address: '軒尼詩道298號廣生行大廈地下A3鋪', addressEn: 'Shop A3, G/F, Kwong Sang Hong Building, 298 Hennessy Road', lat: 22.2774, lng: 114.1766, direction: '中' },
  { name: '灣仔謝斐道 Wan Chai Jaffe Road', nameZh: '灣仔謝斐道', nameEn: 'Wan Chai, Jaffe Road', address: '謝斐道130號建利大廈地下', addressEn: 'G/F, Kin Lee Building, 130 Jaffe Road', lat: 22.2769, lng: 114.1719, direction: '中' },
  { name: '灣仔春園街 Wan Chai Spring Garden Lane', nameZh: '灣仔春園街', nameEn: 'Wan Chai, Spring Garden Lane', address: '春園街59-65號新春園大廈地下A至D舖', addressEn: 'Shop A-D, G/F, New Spring Garden Mansion, 59-65 Spring Garden Lane', lat: 22.2766, lng: 114.1723, direction: '中' },
  
  // 九龍城區 Kowloon City
  { name: '紅磡民裕街 Hung Hom Man Yue Street', nameZh: '紅磡民裕街', nameEn: 'Hung Hom, Man Yue Street', address: '民裕街37-39號凱旋工商中心第1期地下', addressEn: 'G/F, Phase I, Kaiser Estate, 37-39 Man Yue Street', lat: 22.3050, lng: 114.1822, direction: '中' },
  { name: '九龍城衙前塱道 Kowloon City Nga Tsin Long Road', nameZh: '九龍城衙前塱道', nameEn: 'Kowloon City, Nga Tsin Long Road', address: '衙前塱道太子道西404-406號地下', addressEn: 'G/F, 404-406 Prince Edward Road West', lat: 22.3281, lng: 114.1909, direction: '中' },
  { name: '土瓜灣北帝街 To Kwa Wan Pak Tai Street', nameZh: '土瓜灣北帝街', nameEn: 'To Kwa Wan, Pak Tai Street', address: '北帝街79-83號地下', addressEn: 'G/F, 79-83 Pak Tai Street', lat: 22.3161, lng: 114.1883, direction: '中' },
  { name: '土瓜灣道 To Kwa Wan Road', nameZh: '土瓜灣道', nameEn: 'To Kwa Wan Road', address: '土瓜灣道62A號唯一大廈地下', addressEn: 'G/F, Wearbest Building, 62A To Kwa Wan Road', lat: 22.3158, lng: 114.1899, direction: '中' },
  
  // 觀塘區 Kwun Tong
  { name: '九龍灣麗晶 Kowloon Bay Richland', nameZh: '九龍灣麗晶', nameEn: 'Kowloon Bay, Richland', address: '麗晶花園商場1樓132號舖', addressEn: 'Shop 132, 1/F, Richland Gardens Shopping Centre', lat: 22.3229, lng: 114.2132, direction: '東' },
  { name: '九龍灣德福 Kowloon Bay Telford', nameZh: '九龍灣德福', nameEn: 'Kowloon Bay, Telford', address: '宏開道16號德福大廈1樓4號舖', addressEn: 'Shop 4, 1/F, Telford House, 16 Wang Hoi Road', lat: 22.3242, lng: 114.2138, direction: '東' },
  { name: '觀塘康寧道 Kwun Tong Hong Ning Road', nameZh: '觀塘康寧道', nameEn: 'Kwun Tong, Hong Ning Road', address: '康寧道15-17號裕民大廈地下A舖', addressEn: 'Shop A, G/F, Yue Man Mansion, 15-17 Hong Ling Road', lat: 22.3115, lng: 114.2253, direction: '東' },
  { name: '觀塘嘉樂街 Kwun Tong Ka Lok Street', nameZh: '觀塘嘉樂街', nameEn: 'Kwun Tong, Ka Lok Street', address: '嘉樂街35-43號瑞和樓地下', addressEn: 'G/F, Shui Wo House, 35-43 Ka Lok Street', lat: 22.3119, lng: 114.2262, direction: '東' },
  { name: '觀塘廣場 Kwun Tong Plaza', nameZh: '觀塘廣場', nameEn: 'Kwun Tong Plaza', address: '觀塘廣場地下G15及M20號舖', addressEn: 'Shops G15 and M20, Kwun Tong Plaza', lat: 22.3088, lng: 114.2251, direction: '中' },
  { name: '藍田啟田 Lam Tin Kai Tin', nameZh: '藍田啟田', nameEn: 'Lam Tin, Kai Tin', address: '啟田商場地下1B號舖', addressEn: 'Shop 1B, G/F, Kai Tin Shopping Centre', lat: 22.3047, lng: 114.2343, direction: '中' },
  { name: '牛頭角 Ngau Tau Kok', nameZh: '牛頭角', nameEn: 'Ngau Tau Kok', address: '觀塘道257-269號永英樓地下', addressEn: 'G/F, Wing Ying Building, 257-269 Kwun Tong Road', lat: 22.3148, lng: 114.2192, direction: '東' },
  { name: '秀茂坪商場 Sau Mau Ping Shopping Centre', nameZh: '秀茂坪商場', nameEn: 'Sau Mau Ping Shopping Centre', address: '秀茂坪商場1樓113號舖', addressEn: 'Shop 113, Level 1, Sau Mau Ping Shopping Centre', lat: 22.3187, lng: 114.2370, direction: '中' },
  { name: '油塘中心 Yau Tong Centre', nameZh: '油塘中心', nameEn: 'Yau Tong Centre', address: '油塘中心G28-G52號舖', addressEn: 'Shops G28-G52, Yau Tong Centre', lat: 22.2988, lng: 114.2359, direction: '中' },
  
  // 深水埗區 Sham Shui Po
  { name: '長沙灣青山道 Cheung Sha Wan Castle Peak Road', nameZh: '長沙灣青山道', nameEn: 'Cheung Sha Wan, Castle Peak Road', address: '青山道459-463號美奇大廈地下', addressEn: 'G/F, Mei Kei Mansion, 459-463 Castle Peak Road', lat: 22.3383, lng: 114.1585, direction: '中' },
  { name: '長沙灣順寧道 Cheung Sha Wan Shun Ning Road', nameZh: '長沙灣順寧道', nameEn: 'Cheung Sha Wan, Shun Ning Road', address: '順寧道300-306號順輝大廈地下3-11號舖', addressEn: 'Shop 3-11, G/F, Shun Fai Building, 300-306 Shun Ning Road', lat: 22.3366, lng: 114.1591, direction: '中' },
  { name: '美孚荔灣道 Mei Foo Lai Wan Road', nameZh: '美孚荔灣道', nameEn: 'Mei Foo, Lai Wan Road', address: '萬事達廣場1樓86-87號舖', addressEn: 'Shops 86-87, 1/F, Mt. Sterling Mall', lat: 22.3374, lng: 114.1373, direction: '中' },
  { name: '太子長沙灣道 Prince Edward Cheung Sha Wan Road', nameZh: '太子長沙灣道', nameEn: 'Prince Edward, Cheung Sha Wan Road', address: '長沙灣道31-35號鴻運大廈地下', addressEn: 'G/F, Hung Wan Building, 31-35 Cheung Sha Wan Road', lat: 22.3236, lng: 114.1688, direction: '中' },
  { name: '深水埗桂林街 Sham Shui Po Kweilin Street', nameZh: '深水埗桂林街', nameEn: 'Sham Shui Po, Kweilin Street', address: '桂林街137-139號地下', addressEn: 'G/F, 137-139 Kweilin Street', lat: 22.3312, lng: 114.1621, direction: '中' },
  { name: '深水埗汝州街 Sham Shui Po Yu Chau Street', nameZh: '深水埗汝州街', nameEn: 'Sham Shui Po, Yu Chau Street', address: '汝州街251-255號地下', addressEn: 'G/F, 251-255 Yu Chau Street', lat: 22.3317, lng: 114.1632, direction: '中' },
  { name: '石硤尾大埔道 Shek Kip Mei Tai Po Road', nameZh: '石硤尾大埔道', nameEn: 'Shek Kip Mei, Tai Po Road', address: '大埔道196號嘉順大廈地下及1樓', addressEn: 'G-1/F, Ka Shun Building, 196 Tai Po Road', lat: 22.3349, lng: 114.1683, direction: '中' },
  { name: '石硤尾偉智街 Shek Kip Mei Wai Chi Street', nameZh: '石硤尾偉智街', nameEn: 'Shek Kip Mei, Wai Chi Street', address: '偉智街39號寶田大廈地下23至24號舖', addressEn: 'Shops 23-24, G/F, Po Tin Building, 39 Wai Chi Street', lat: 22.3362, lng: 114.1692, direction: '中' },
  
  // 黃大仙區 Wong Tai Sin
  { name: '彩雲 Choi Wan', nameZh: '彩雲', nameEn: 'Choi Wan', address: '彩雲商場第2期2樓A206號舖', addressEn: 'Shop A206, 2/F, Choi Wan Shopping Centre (Phase 2)', lat: 22.3316, lng: 114.2163, direction: '東' },
  { name: '新蒲崗崇齡街 San Po Kong Shung Ling Street', nameZh: '新蒲崗崇齡街', nameEn: 'San Po Kong, Shung Ling Street', address: '崇齡街19-21號地下', addressEn: 'G/F, 19-21 Shung Ling Street', lat: 22.3366, lng: 114.1969, direction: '東' },
  { name: '黃大仙豪苑 Wong Tai Sin Tropicana', nameZh: '黃大仙豪苑', nameEn: 'Wong Tai Sin, Tropicana', address: '龍翔道110號豪苑地下1號舖', addressEn: 'Shop 1, G/F, Tropicana Garden, 110 Lung Cheung Road', lat: 22.3389, lng: 114.1937, direction: '東' },
  { name: '黃大仙環鳳街 Wong Tai Sin Wan Fung Street', nameZh: '黃大仙環鳳街', nameEn: 'Wong Tai Sin, Wan Fung Street', address: '鳳凰新邨環鳳街8-10號華頌樓地下', addressEn: 'G/F Wah Chung Mansion, 8-10 Wan Fung Street', lat: 22.3395, lng: 114.1942, direction: '東' },
  
  // 油尖旺區 Yau Tsim Mong
  { name: '佐敦道 Jordan Road', nameZh: '佐敦道', nameEn: 'Jordan Road', address: '佐敦道48-50號可群大廈地下', addressEn: 'G/F, Ho Kwan Building, 48-50 Jordan Road', lat: 22.3045, lng: 114.1727, direction: '中' },
  { name: '旺角亞皆老街 Mong Kok Argyle Street', nameZh: '旺角亞皆老街', nameEn: 'Mong Kok, Argyle Street', address: '亞皆老街45號雅佳樓地下、1樓及2樓', addressEn: 'G-2/F, Argyle House, 45 Argyle Street', lat: 22.3220, lng: 114.1704, direction: '中' },
  { name: '旺角登打士街 Mong Kok Dundas Street', nameZh: '旺角登打士街', nameEn: 'Mong Kok, Dundas Street', address: '登打士街2-6號寶亨大廈地下', addressEn: 'G/F, Po Hang Building, 2-6 Dundas Street', lat: 22.3189, lng: 114.1714, direction: '中' },
  { name: '旺角花園街 Mong Kok Fa Yuen Street', nameZh: '旺角花園街', nameEn: 'Mong Kok, Fa Yuen Street', address: '花園街2-16號好景商業大廈地下25號舖', addressEn: 'Shop 25, G/F, Ho King Commercial Centre, 2-16 Fa Yuen Street', lat: 22.3202, lng: 114.1719, direction: '中' },
  { name: '旺角彌敦中心 Mong Kok Nathan Centre', nameZh: '旺角彌敦中心', nameEn: 'Mong Kok, Nathan Centre', address: '彌敦道580號彌敦中心地下G3A號舖、閣樓、1樓及2樓', addressEn: 'Shop G3A on G/F, M/F, 1-2/F, Nathan Centre, 580 Nathan Road', lat: 22.3181, lng: 114.1710, direction: '中' },
  { name: '太子彌敦道 Prince Edward Nathan Road', nameZh: '太子彌敦道', nameEn: 'Prince Edward, Nathan Road', address: '彌敦道763-767號新望大廈地下及1樓B舖', addressEn: 'Shop B, 1/F and G/F, Newish Mansion, 763-767 Nathan Road', lat: 22.3241, lng: 114.1694, direction: '中' },
  { name: '大角咀埃華街 Tai Kok Tsui Ivy Street', nameZh: '大角咀埃華街', nameEn: 'Tai Kok Tsui, Ivy Street', address: '埃華街79-83號大眾樓地下', addressEn: 'G/F, Tai Chung Building, 79-83 Ivy Street', lat: 22.3195, lng: 114.1626, direction: '中' },
  { name: '尖沙咀漢口道 Tsim Sha Tsui Hankow Road', nameZh: '尖沙咀漢口道', nameEn: 'Tsim Sha Tsui, Hankow Road', address: '漢口道39-41號麥仕維中心地下', addressEn: 'Basement and G/F, Maxwell Centre, 39-41 Hankow Road', lat: 22.2978, lng: 114.1722, direction: '中' },
  { name: '尖沙咀寶勒巷 Tsim Sha Tsui Prat Avenue', nameZh: '尖沙咀寶勒巷', nameEn: 'Tsim Sha Tsui, Prat Avenue', address: '寶勒巷2-4號金帝行地下及1樓', addressEn: 'UG and 1/F, Kundamal House, 2-4 Prat Avenue', lat: 22.2986, lng: 114.1734, direction: '中' },
  { name: '尖沙咀東 Tsim Sha Tsui East', nameZh: '尖沙咀東', nameEn: 'Tsim Sha Tsui East', address: '科學館道14號新文華商業中心地下86號舖', addressEn: 'Shop 86, G/F, New Mandarin Plaza, 14 Science Museum Road', lat: 22.3011, lng: 114.1767, direction: '中' },
  { name: '油麻地砵蘭街 Yau Ma Tei Portland Street', nameZh: '油麻地砵蘭街', nameEn: 'Yau Ma Tei, Portland Street', address: '砵蘭街62-66號昌威大廈地下', addressEn: 'G/F, Cheong Wai Building, 62-66 Portland Street', lat: 22.3115, lng: 114.1712, direction: '中' },
  { name: '油麻地上海街 Yau Ma Tei Shanghai Street', nameZh: '油麻地上海街', nameEn: 'Yau Ma Tei, Shanghai Street', address: '上海街213-219號及223-225號地下', addressEn: 'G/F, 213-219 and 223-225 Shanghai Street', lat: 22.3122, lng: 114.1702, direction: '中' },
  
  // 離島區 Islands
  { name: '長洲 Cheung Chau', nameZh: '長洲', nameEn: 'Cheung Chau', address: '大新後街與山頂道1148號地段59號蓮富苑地下', addressEn: 'G/F Lot 1148 Peak Road (No. 59), Lin Fu Yuen', lat: 22.2098, lng: 114.0289, direction: '西' },
  { name: '梅窩 Mui Wo', nameZh: '梅窩', nameEn: 'Mui Wo', address: '梅窩碼頭路13號海灣樓A座地下', addressEn: 'Shop A, G/F, Harbour View Villa, 13 Mui Wo Ferry Pier Road', lat: 22.2642, lng: 113.9902, direction: '西' },
  { name: '逸東商場 Yat Tung Shopping Centre', nameZh: '逸東商場', nameEn: 'Yat Tung Shopping Centre', address: '逸東邨逸東商場地下29號舖', addressEn: 'Shop 29, G/F, Yat Tung Shopping Centre, Yat Tung Estate', lat: 22.2781, lng: 113.9443, direction: '中' },
  
  // 葵青區 Kwai Tsing
  { name: '葵涌大隴街 Kwai Chung Tai Loong Street', nameZh: '葵涌大隴街', nameEn: 'Kwai Chung, Tai Loong Street', address: '大隴街153號怡勝花園地下5號舖', addressEn: 'Shop No.5, G/F, Victory Garden, 153 Tai Loong Street', lat: 22.3635, lng: 114.1285, direction: '中' },
  { name: '葵涌榮芳路 Kwai Chung Wing Fong Road', nameZh: '葵涌榮芳路', nameEn: 'Kwai Chung, Wing Fong Road', address: '榮芳路3號守運大廈地下5號舖', addressEn: 'Shop 5, G/F, Southern Building, 3 Wing Fong Road', lat: 22.3621, lng: 114.1302, direction: '中' },
  { name: '葵芳 Kwai Fong', nameZh: '葵芳', nameEn: 'Kwai Fong', address: '葵義路15號葵芳閣地下39-A舖', addressEn: 'Shops A & B, Unit 39, G/F Kwai Fong Terrace, 15 Kwai Yi Road', lat: 22.3571, lng: 114.1275, direction: '中' },
  { name: '葵興 Kwai Hing', nameZh: '葵興', nameEn: 'Kwai Hing', address: '興芳路166-174號新葵興花園2樓21號舖', addressEn: 'Shop 21, 1/F, Sun Kwai Hing Gardens, 166-174 Hing Fong Road', lat: 22.3628, lng: 114.1339, direction: '中' },
  { name: '青衣城 Tsing Yi Maritime Square', nameZh: '青衣城', nameEn: 'Tsing Yi, Maritime Square', address: '青衣城商場G19-G21號舖', addressEn: 'Shop G19-G21, Maritime Square', lat: 22.3574, lng: 114.1086, direction: '中' },
  
  // 北區 North
  { name: '粉嶺聯和墟 Fanling Luen Wo Market', nameZh: '粉嶺聯和墟', nameEn: 'Fanling, Luen Wo Market', address: '聯和墟聯昌街1-3號地下', addressEn: 'G/F, Luen Wo Market, 1-3 Luen Cheong Street', lat: 22.4920, lng: 114.1399, direction: '北' },
  { name: '上水石湖墟 Sheung Shui Shek Wu Hui', nameZh: '上水石湖墟', nameEn: 'Sheung Shui, Shek Wu Hui', address: '石湖墟新豐路134-140A號A地下', addressEn: 'G/F, 134-140A San Fung Avenue', lat: 22.5018, lng: 114.1286, direction: '北' },
  
  // 西貢區 Sai Kung
  { name: '西貢 Sai Kung', nameZh: '西貢', nameEn: 'Sai Kung', address: '褔民路22-40號西貢苑8-10號舖', addressEn: 'Shops 8-10, Sai Kung Town Villa, 22-40 Fuk Man Road', lat: 22.3816, lng: 114.2744, direction: '中' },
  { name: '日出康城 The LOHAS', nameZh: '日出康城', nameEn: 'The LOHAS', address: '康城路1號康城4樓419號舖', addressEn: 'Shop Unit 419, 4/F The LOHAS, 1 LOHAS Road, Tseung Kwan O', lat: 22.2920, lng: 114.2646, direction: '中' },
  { name: '將軍澳寶林 Tseung Kwan O Po Lam', nameZh: '將軍澳寶林', nameEn: 'Tseung Kwan O, Po Lam', address: '寶林邨寶林商場1樓201-202號舖', addressEn: 'Shop 201-202, 1/F, Po Lam Shopping Centre, Po Lam Estate', lat: 22.3215, lng: 114.2582, direction: '中' },
  { name: '將軍澳尚德 Tseung Kwan O Sheung Tak', nameZh: '將軍澳尚德', nameEn: 'Tseung Kwan O, Sheung Tak', address: 'TKO Spot 2樓236室', addressEn: 'Shop 236, 2/F, TKO Spot', lat: 22.3118, lng: 114.2619, direction: '中' },
  
  // 沙田區 Shatin
  { name: '馬鞍山廣場 Ma On Shan Plaza', nameZh: '馬鞍山廣場', nameEn: 'Ma On Shan Plaza', address: '馬鞍山廣場3樓305號舖', addressEn: 'Shop 305, Level 3, Ma On Shan Plaza', lat: 22.4253, lng: 114.2309, direction: '中' },
  { name: '沙田沙角街 Sha Tin Sha Kok Street', nameZh: '沙田沙角街', nameEn: 'Sha Tin, Sha Kok Street', address: '沙角街7-11號翠華花園地下1-4號舖', addressEn: 'Shop 1-4, G/F, Greenwood Garden, 7-11 Sha Kok Street', lat: 22.3818, lng: 114.1893, direction: '北' },
  { name: '大圍道 Tai Wai Road', nameZh: '大圍道', nameEn: 'Tai Wai Road', address: '大圍道20-22號恩安樓地下', addressEn: 'G/F, Yan On Building, 20-22 Tai Wai Road', lat: 22.3729, lng: 114.1772, direction: '中' },
  
  // 大埔區 Tai Po
  { name: '大埔廣褔道 Tai Po Kwong Fuk Road', nameZh: '大埔廣褔道', nameEn: 'Tai Po, Kwong Fuk Road', address: '廣褔道158-172號大埔商業大廈地下', addressEn: 'G/F, Tai Po Commercial Centre, 158-172 Kwong Fuk Road', lat: 22.4506, lng: 114.1639, direction: '北' },
  { name: '大埔廣場 Tai Po Plaza', nameZh: '大埔廣場', nameEn: 'Tai Po Plaza', address: '大埔廣場地下商場7號舖', addressEn: 'Unit 7 Level 1, Tai Po Plaza', lat: 22.4481, lng: 114.1644, direction: '中' },
  
  // 荃灣區 Tsuen Wan
  { name: '荃灣青山道 Tsuen Wan Castle Peak Road', nameZh: '荃灣青山道', nameEn: 'Tsuen Wan, Castle Peak Road', address: '青山公路300-350號荃錦中心地下B2舖', addressEn: 'Shop B2, G/F, Tsuen Kam Centre, 300-350 Castle Peak Road', lat: 22.3714, lng: 114.1148, direction: '中' },
  { name: '荃灣沙咀道 Tsuen Wan Sha Tsui Road', nameZh: '荃灣沙咀道', nameEn: 'Tsuen Wan, Sha Tsui Road', address: '沙咀道301-303號眾安大廈地下', addressEn: 'G/F, Chung On Building, 301-303 Sha Tsui Road', lat: 22.3697, lng: 114.1133, direction: '中' },
  { name: '荃灣荃富街 Tsuen Wan Tsuen Fu Street', nameZh: '荃灣荃富街', nameEn: 'Tsuen Wan, Tsuen Fu Street', address: '荃富街富麗商場2樓1號舖', addressEn: 'Shop 1, 2/F, Wealthy Garden, Tsuen Fu Street', lat: 22.3738, lng: 114.1171, direction: '中' },
  
  // 屯門區 Tuen Mun
  { name: '屯門建榮街 Tuen Mun Kin Wing Street', nameZh: '屯門建榮街', nameEn: 'Tuen Mun, Kin Wing Street', address: '建榮街24-30號建榮商業大廈地下3-8號舖', addressEn: 'Shops 3-8, G/F Kin Wing Commercial Building 24-30 Kin Wing Street', lat: 22.3905, lng: 113.9735, direction: '西' },
  { name: '屯門市廣場 Tuen Mun Town Plaza', nameZh: '屯門市廣場', nameEn: 'Tuen Mun Town Plaza', address: '屯門市廣場第3期地段277號地下', addressEn: 'TMTL 277, Tuen Mun Town Plaza, Phase III', lat: 22.3911, lng: 113.9762, direction: '中' },
  
  // 元朗區 Yuen Long
  { name: '天水圍 Tin Shui Wai', nameZh: '天水圍', nameEn: 'Tin Shui Wai', address: '嘉湖(二期)1樓101舖', addressEn: 'Shop 101, 1/F, +Woo (Phase 2)', lat: 22.4598, lng: 114.0024, direction: '西' },
  { name: '元朗青山公路 Yuen Long Castle Peak Road', nameZh: '元朗青山公路', nameEn: 'Yuen Long, Castle Peak Road', address: '青山公路196-202號元朗大廈地下3-4號舖及1樓B室', addressEn: 'Shops 3 & 4 on Ground Floor and Portion B on 1st Floor, Yuen Long Building, Nos. 196-202 Castle Peak Road', lat: 22.4438, lng: 114.0343, direction: '西' },
  { name: '元朗洪水橋 Yuen Long Hung Shui Kiu', nameZh: '元朗洪水橋', nameEn: 'Yuen Long, Hung Shui Kiu', address: '洪水橋洪堤路2號錦珊園地下3及5-9號舖', addressEn: 'Shops 3&5-9, G/F Coronet Court, 2 Hung Tai Road', lat: 22.4292, lng: 113.9938, direction: '西' },
  { name: '元朗泰衡街 Yuen Long Tai Hang Street', nameZh: '元朗泰衡街', nameEn: 'Yuen Long, Tai Hang Street', address: '泰衡街14-20號大興大廈地下', addressEn: 'G/F, Tai Hing Building, 14-20 Tai Hang Street', lat: 22.4456, lng: 114.0329, direction: '西' },
];

// App version
export const APP_VERSION = '1.0.0';

// Storage keys
export const STORAGE_KEYS = {
  USER_DATA: '@bazi_user_data',
  HISTORY: '@bazi_history',
  LANGUAGE: '@app_language',
  SUBSCRIPTION: '@subscription_status',
};

// Subscription products
export const SUBSCRIPTION_PRODUCTS = {
  monthly: {
    id: 'com.bazimarksix.monthly',
    price: 'HK$8',
    period: 'month',
  },
  yearly: {
    id: 'com.bazimarksix.yearly',
    price: 'HK$80',
    period: 'year',
  },
};

// Mark Six betting branch operating hours
// Most branches follow this standard schedule (day of week: 0=Sunday, 6=Saturday)
export const BRANCH_OPERATING_HOURS = {
  // Standard hours for most branches
  standard: {
    0: { open: '09:00', close: '23:30' },  // Sunday
    1: { open: '12:00', close: '18:00' },  // Monday (most branches)
    2: { open: '12:00', close: '21:35' },  // Tuesday
    3: { open: '12:00', close: '23:15' },  // Wednesday (draw day - extended)
    4: { open: '12:00', close: '23:30' },  // Thursday
    5: { open: '12:00', close: '21:00' },  // Friday
    6: { open: '12:00', close: '23:30' },  // Saturday (draw day - extended)
  },
  // Some branches have longer Monday hours
  extendedMonday: {
    0: { open: '09:00', close: '23:30' },
    1: { open: '12:00', close: '21:30' },  // Extended Monday
    2: { open: '12:00', close: '21:35' },
    3: { open: '12:00', close: '23:15' },
    4: { open: '12:00', close: '23:30' },
    5: { open: '12:00', close: '21:30' },  // Extended Friday
    6: { open: '12:00', close: '23:30' },
  },
};

// Utility function to validate and adjust purchase time based on operating hours
export const getValidPurchaseTime = (date: Date, suggestedTime: string): string => {
  const dayOfWeek = date.getDay();
  const schedule = BRANCH_OPERATING_HOURS.standard[dayOfWeek as keyof typeof BRANCH_OPERATING_HOURS.standard];
  
  if (!schedule) return suggestedTime;
  
  // Convert times to minutes for comparison
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const suggestedMinutes = timeToMinutes(suggestedTime);
  const openMinutes = timeToMinutes(schedule.open);
  const closeMinutes = timeToMinutes(schedule.close);
  
  // If suggested time is before opening, use opening time + 30 minutes
  if (suggestedMinutes < openMinutes) {
    const adjustedMinutes = openMinutes + 30;
    const hours = Math.floor(adjustedMinutes / 60);
    const minutes = adjustedMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  // If suggested time is after closing, use 1 hour before closing
  if (suggestedMinutes > closeMinutes) {
    const adjustedMinutes = closeMinutes - 60;
    const hours = Math.floor(adjustedMinutes / 60);
    const minutes = adjustedMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  // Suggested time is within operating hours
  return suggestedTime;
};

// AdMob configuration
export const ADMOB_CONFIG = {
  ios: {
    banner: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy',
    interstitial: 'ca-app-pub-xxxxxxxxxxxxx/zzzzzzzzzz',
  },
  android: {
    banner: 'ca-app-pub-xxxxxxxxxxxxx/aaaaaaaaaa',
    interstitial: 'ca-app-pub-xxxxxxxxxxxxx/bbbbbbbbbb',
  },
  testBanner: 'ca-app-pub-3940256099942544/6300978111',
  testInterstitial: 'ca-app-pub-3940256099942544/1033173712',
};
