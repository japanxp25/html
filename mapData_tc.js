const regionNameToCssClass = {
	"北海道": "region-hokkaido",
	"本州": "region-honshu",
	"本州": "region-honshu",
	"本州": "region-honshu",
	"本州": "region-honshu",
	"本州": "region-honshu",
	"四国": "region-shikoku",
	"九州": "region-kyushu",
	"沖縄": "region-okinawa"
};

const prefectureIdToNameMap = {
	"map-hokkaido": "北海道", "map-aomori": "青森", "map-iwate": "岩手", "map-miyagi": "宮城",
	"map-akita": "秋田", "map-yamagata": "山形", "map-fukushima": "福島", "map-ibaraki": "茨城",
	"map-tochigi": "栃木", "map-gunma": "群馬", "map-saitama": "埼玉", "map-chiba": "千葉",
	"map-tokyo": "東京", "map-kanagawa": "神奈川", "map-niigata": "新潟", "map-toyama": "富山",
	"map-ishikawa": "石川", "map-fukui": "福井", "map-yamanashi": "山梨", "map-nagano": "長野",
	"map-gifu": "岐阜", "map-shizuoka": "静岡", "map-aichi": "愛知", "map-mie": "三重",
	"map-shiga": "滋賀", "map-kyoto": "京都", "map-osaka": "大阪", "map-hyogo": "兵庫",
	"map-nara": "奈良", "map-wakayama": "和歌山", "map-tottori": "鳥取", "map-shimane": "島根",
	"map-okayama": "岡山", "map-hiroshima": "広島", "map-yamaguchi": "山口", "map-tokushima": "徳島",
	"map-kagawa": "香川", "map-ehime": "愛媛", "map-kochi": "高知", "map-fukuoka": "福岡",
	"map-saga": "佐賀", "map-nagasaki": "長崎", "map-kumamoto": "熊本", "map-oita": "大分",
	"map-miyazaki": "宮崎", "map-kagoshima": "鹿児島", "map-okinawa": "沖縄"
};

const prefectureToRegionMap = {
	"北海道": "北海道",
	"青森": "本州", "岩手": "本州", "宮城": "本州", "秋田": "本州", "山形": "本州", "福島": "本州",
	"茨城": "本州", "栃木": "本州", "群馬": "本州", "埼玉": "本州", "千葉": "本州", "東京": "本州", "神奈川": "本州",
	"新潟": "本州", "富山": "本州", "石川": "本州", "福井": "本州", "山梨": "本州", "長野": "本州", "岐阜": "本州", "静岡": "本州", "愛知": "本州",
	"三重": "本州", "滋賀": "本州", "京都": "本州", "大阪": "本州", "兵庫": "本州", "奈良": "本州", "和歌山": "本州",
	"鳥取": "本州", "島根": "本州", "岡山": "本州", "広島": "本州", "山口": "本州",
	"徳島": "四国", "香川": "四国", "愛媛": "四国", "高知": "四国",
	"福岡": "九州", "佐賀": "九州", "長崎": "九州", "熊本": "九州", "大分": "九州", "宮崎": "九州", "鹿児島": "九州",
	"沖縄": "沖縄"
};

const prefectureCoords = [
[640,34,782,132, "北海道", "region-hokkaido","region-hokkaido","l"],

[640,141,752,208, "青森", "region-honshu","region-honshu","l"],
[640,210,695,307, "秋田", "region-honshu","region-honshu","p"],
[697,210,752,307, "岩手", "region-honshu","region-honshu","p"],
[640,310,695,396, "山形", "region-honshu","region-honshu","p"],
[697,310,752,396, "宮城", "region-honshu","region-honshu","p"],
[640,398,752,453, "福島", "region-honshu","region-honshu","l"],
[583,398,638,453, "新潟", "region-honshu","region-honshu","p"],
[536,398,581,453, "富山", "region-honshu","region-honshu","p"],
[484,398,534,453, "石川", "region-honshu","region-honshu","p"],
[640,455,695,515, "群馬", "region-honshu","region-honshu","p"],
[697,455,752,515, "栃木", "region-honshu","region-honshu","p"],
[697,517,752,577, "茨城", "region-honshu","region-honshu","p"],
[640,517,695,577, "埼玉", "region-honshu","region-honshu","p"],
[697,579,752,634, "千葉", "region-honshu","region-honshu","p"],
[640,579,695,634, "東京", "region-honshu","region-honshu","p"],
[640,636,695,691, "神奈川", "region-honshu","region-honshu","p"],
[583,455,638,515, "長野", "region-honshu","region-honshu","p"],
[583,517,638,577, "山梨", "region-honshu","region-honshu","p"],
[536,455,581,515, "岐阜", "region-honshu","region-honshu","p"],
[583,579,638,634, "静岡", "region-honshu","region-honshu","p"],
[536,517,581,577, "愛知", "region-honshu","region-honshu","p"],
[484,455,534,515, "福井", "region-honshu","region-honshu","p"],
[484,517,534,577, "滋賀", "region-honshu","region-honshu","p"],
[484,579,534,639, "三重", "region-honshu","region-honshu","p"],
[430,455,482,515, "京都", "region-honshu","region-honshu","p"],
[430,517,482,577, "奈良", "region-honshu","region-honshu","p"],
[378,455,428,515, "兵庫", "region-honshu","region-honshu","p"],
[378,517,428,577, "大阪", "region-honshu","region-honshu","p"],
[388,579,482,639, "和歌山", "region-honshu","region-honshu","l"],
[324,455,376,515, "鳥取", "region-honshu","region-honshu","p"],
[324,517,376,577, "岡山", "region-honshu","region-honshu","p"],
[272,455,322,515, "島根", "region-honshu","region-honshu","p"],
[272,517,322,577, "広島", "region-honshu","region-honshu","p"],
[220,455,270,577, "山口", "region-honshu","region-honshu","p"],

[230,590,300,655, "香川", "region-shikoku","region-shikoku","p"],
[230,657,300,712, "愛媛", "region-shikoku","region-shikoku","p"],
[302,590,372,655, "徳島", "region-shikoku","region-shikoku","p"],
[302,657,372,712, "高知", "region-shikoku","region-shikoku","p"],

[50,505,100,570, "佐賀", "region-kyushu","region-kyushu","p"],
[102,505,152,570, "福岡", "region-kyushu","region-kyushu","p"],
[154,505,204,570, "大分", "region-kyushu","region-kyushu","p"],
[50,572,100,637, "長崎", "region-kyushu","region-kyushu","p"],
[102,572,152,637, "熊本", "region-kyushu","region-kyushu","p"],
[154,572,204,669, "宮崎", "region-kyushu","region-kyushu","p"],
[50,639,152,689, "鹿児島", "region-kyushu","region-kyushu","l"],

[20,700,100,745, "沖縄", "region-okinawa","region-okinawa","p"]


];

console.log('loaded');
