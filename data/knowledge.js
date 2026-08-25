export const LAST_REVIEWED = "2026-08-24";

export const SOURCES = [
  {
    title: "Oregon DMV — Titling and Registering Your Vehicle",
    url: "https://www.oregon.gov/odot/DMV/pages/vehicle/titlereg.aspx"
  },
  {
    title: "Oregon DMV — New to Oregon",
    url: "https://www.oregon.gov/odot/DMV/Pages/New2or/moving.aspx"
  },
  {
    title: "Oregon DMV — Vehicle Fees",
    url: "https://www.oregon.gov/odot/DMV/Pages/Fees/Vehicle.aspx"
  },
  {
    title: "Oregon DMV — Forms",
    url: "https://www.oregon.gov/odot/DMV/Pages/Form/index.aspx"
  },
  {
    title: "Oregon DMV — Instruction Permit Under 18",
    url: "https://www.oregon.gov/odot/DMV/Teen/Pages/permit.aspx"
  },
  {
    title: "Oregon DMV — Driver License Under 18",
    url: "https://www.oregon.gov/odot/DMV/Teen/Pages/license.aspx"
  },
  {
    title: "Oregon DMV — Driver License Over 18",
    url: "https://www.oregon.gov/odot/DMV/Pages/DriverID/licenseget.aspx"
  },
  {
    title: "警視庁 — 外国免許から日本免許への切替",
    url: "https://www.keishicho.metro.tokyo.lg.jp/menkyo/menkyo/kokugai/kokugai05.html"
  },
  {
    title: "警察庁 — 外国の運転免許をお持ちの方",
    url: "https://www.npa.go.jp/policies/application/license_renewal/have_DL_issed_another_country.html/pdf/pdf/QA.html"
  }
];

export const JAPAN_OREGON_GUIDES = {
  japanToOregon: {
    label: "日本 → Oregon",
    title: "日本免許からOregon免許へ",
    summary: "条件を満たす場合、Oregonのknowledge testとdrive testが免除される可能性があります。",
    exempt: ["Class C knowledge test（学科試験）", "Class C drive test（実技試験）"],
    requirements: [
      "新しくOregonの居住者となり、Oregon DMVで免許を申請する",
      "日本の運転免許証をOregon DMVへ提出する",
      "日本の免許が有効、または失効後1年以内である",
      "本人確認、生年月日、Oregon住所の証明を提出する",
      "SSNを提供する、またはSSNを持たないことを電子的に申告する",
      "vision test、写真撮影、該当料金の支払いを行う"
    ],
    caution: "Oregon DMVは公式ページで「may not have to」と案内しています。最終的な試験免除の適用はDMV窓口で確認してください。",
    sourceUrl: "https://www.oregon.gov/odot/DMV/Pages/DriverID/licenseget.aspx"
  },
  oregonToJapan: {
    label: "Oregon → 日本",
    title: "Oregon免許から日本免許へ",
    summary: "Oregon州免許は、日本の外免切替で知識確認・技能確認の免除対象として案内されています。",
    exempt: ["知識確認", "技能確認"],
    requirements: [
      "有効なOregon州の運転免許証を所持している",
      "免許取得後、米国で通算3か月以上滞在したことを証明する",
      "日本での住所地を管轄する運転免許センター等へ本人が申請する",
      "Oregon免許証と、指定機関が作成した日本語翻訳文を用意する",
      "住民票など住所要件を満たす書類と、滞在期間を証明する資料を用意する",
      "適性検査、書類審査、手数料など申請先の手続きを完了する"
    ],
    caution: "必要書類、予約方法、受付場所は都道府県警察により異なる場合があります。住所地の運転免許センターへ事前確認してください。",
    sourceUrl: "https://www.keishicho.metro.tokyo.lg.jp/menkyo/menkyo/kokugai/kokugai05.html"
  }
};

export const AGE_GUIDES = {
  under15: {
    label: "14歳以下",
    title: "Class C permitの申請年齢前です",
    summary: "OregonのClass C instruction permitは15歳から申請できます。",
    steps: [
      "Oregon Driver Manualで交通ルールを学ぶ",
      "公式practice knowledge testで準備する",
      "15歳になったらProvisional Instruction Permitの手順を確認する"
    ],
    notes: ["年齢以外の資格や必要書類は申請時にOregon DMVで再確認してください。"],
    sourceUrl: "https://www.oregon.gov/odot/DMV/Teen/Pages/permit.aspx"
  },
  age15: {
    label: "15歳",
    title: "Provisional Instruction Permitを申請できます",
    summary: "学科試験、視力検査、本人確認などを経て、練習用permitを取得する段階です。",
    steps: [
      "Oregon Driver Manualを学び、knowledge testを準備する",
      "Standard IDかREAL IDかを決め、本人確認・住所確認書類を用意する",
      "knowledge testとvision testを受ける",
      "原則、親またはlegal guardianの同意を得る",
      "permit取得後、21歳以上の有効な免許保有者を隣席させて練習する"
    ],
    notes: ["免許取得に必要な監督運転時間として数える場合、監督者には免許保有期間の条件があります。"],
    sourceUrl: "https://www.oregon.gov/odot/DMV/Teen/Pages/permit.aspx"
  },
  age16to17: {
    label: "16～17歳",
    title: "Provisional Driver Licenseの対象年齢です",
    summary: "permitの保持期間と監督運転時間を満たしてから、provisional licenseへ進みます。",
    steps: [
      "instruction permitを少なくとも6か月保持する",
      "監督運転を100時間行う、または承認済みDriver Ed修了時は50時間行う",
      "必要なknowledge、vision、drive testを完了する",
      "原則、親またはlegal guardianの同意と学校要件の証明を準備する",
      "発行後の夜間運転・同乗者などのprovisional restrictionsを確認する"
    ],
    notes: ["結婚している、または法的にemancipatedの場合は、証明書類により保護者同意が不要になる場合があります。"],
    sourceUrl: "https://www.oregon.gov/odot/DMV/Teen/Pages/license.aspx"
  },
  age18to64: {
    label: "18～64歳",
    title: "成人向けClass C license手続きです",
    summary: "初回取得か、州外・外国免許からの切替かによって試験要否が変わります。",
    steps: [
      "Standard IDかREAL IDかを決める",
      "本人確認・生年月日・Oregon住所の証明を用意する",
      "必要に応じてknowledge testとvision testを受ける",
      "練習が必要ならinstruction permitを取得する",
      "必要に応じてdrive testを予約・合格し、発行料金を支払う"
    ],
    notes: ["有効な州外・一部外国免許の切替では、knowledge testやdrive testが免除される場合があります。"],
    sourceUrl: "https://www.oregon.gov/odot/DMV/Pages/DriverID/licenseget.aspx"
  },
  age65plus: {
    label: "65歳以上",
    title: "新規取得は成人向け手続きです",
    summary: "新規取得の基本手順は18歳以上と同じです。更新時には追加条件があります。",
    steps: [
      "本人確認・住所確認書類を用意する",
      "必要なknowledge、vision、drive testを確認する",
      "DMV officeまたはDMV2Uで予約・手続き方法を確認する",
      "更新の場合はDMV officeで対面のvision testを受ける"
    ],
    notes: ["Oregon DMVは65歳以上のonline renewalを受け付けず、窓口での視力検査を案内しています。"],
    sourceUrl: "https://www.oregon.gov/odot/DMV/Pages/DriverID/licenseget.aspx"
  }
};

export const FLOWS = {
  purchase: {
    label: "オレゴン州で車を購入した",
    summary: "原則、売買日から30日以内にtitle申請を提出します。",
    steps: [
      "売主から署名済みの原本titleまたは所有権書類を受け取る",
      "必要なbill of sale、lien release、odometer disclosureをそろえる",
      "Application for Title and Registrationを作成する",
      "title、登録、プレートの該当料金を確認する",
      "DMV窓口または郵送で提出し、送付前に書類のコピーを保管する"
    ],
    notes: [
      "Oregon title車の移転申請が31～60日になると$25、60日超では$50の遅延料が案内されています。",
      "ローンがある場合はlien holderが申請を提出することがあります。"
    ]
  },
  outOfState: {
    label: "州外の車をオレゴン州へ持ち込む",
    summary: "Oregonで登録するには、通常Oregon titleの取得が必要です。",
    steps: [
      "州外で発行された原本titleまたは所有権書類を用意する",
      "Application for Title and Registrationを作成する",
      "DMVでVIN inspectionを受ける（公式案内では$9）",
      "必要なlien release、odometer disclosure、追加証明をそろえる",
      "地域によりDEQ emissions testが必要か確認して提出する"
    ],
    notes: [
      "新しいOregon居住者は、原則30日以内に車両のtitleと登録を行うよう案内されています。",
      "PortlandまたはMedford周辺では多くの車両にDEQ検査が必要です。"
    ]
  },
  transfer: {
    label: "名義を追加・削除・変更したい",
    summary: "所有者が変わる場合は、通常のtitle申請手順に従います。",
    steps: [
      "現在の原本titleと、現在の所有者からのreleaseを確認する",
      "Application for Title and Registrationに新しい所有者情報を記入する",
      "過去のlienがあれば原本lien releaseを用意する",
      "必要なodometer disclosureと料金を確認する",
      "DMV窓口または郵送で提出する"
    ],
    notes: [
      "ローン中の車両は、所有者の追加・削除にlien holderの承認が必要な場合があります。"
    ]
  },
  lost: {
    label: "Oregon titleを紛失した",
    summary: "最後に発行されたOregon titleのreplacementを申請します。",
    steps: [
      "Application for Replacement Titleを作成する",
      "該当するtitle feeを確認する",
      "DMV窓口または郵送で提出する"
    ],
    notes: [
      "移転を伴う場合、車両年式やodometer disclosureの要否で手順が変わります。"
    ]
  }
};

export function publicKnowledge() {
  return { lastReviewed: LAST_REVIEWED, sources: SOURCES, flows: FLOWS, ageGuides: AGE_GUIDES, japanOregonGuides: JAPAN_OREGON_GUIDES };
}
