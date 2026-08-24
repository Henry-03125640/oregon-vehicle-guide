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
  }
];

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
  return { lastReviewed: LAST_REVIEWED, sources: SOURCES, flows: FLOWS };
}

