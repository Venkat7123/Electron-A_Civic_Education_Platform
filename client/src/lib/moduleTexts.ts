import { useProgress } from "@/hooks/useProgress";

export function useModuleText() {
  const { state } = useProgress();
  const lang = state.lang === "ta" ? "ta" : "en";
  return MODULE_TEXTS[lang];
}

export const MODULE_TEXTS = {
  en: {
    // Module 1
    m1_title: "Module 1: Pre-Election & Campaigning",
    m1_s1_title: "The Official Announcement",
    m1_s2_title: "Candidate Nominations",
    m1_s3_title: "Campaigning & Manifestos",
    m1_s4_title: "Code of Conduct",
    m1_s5_title: "Module Complete",
    
    m1_timeline_1_e: "📢 Notification Issued",
    m1_timeline_1_d: "ECI officially announces the election schedule.",
    m1_timeline_2_e: "📝 Nominations Open",
    m1_timeline_2_d: "Candidates file papers at Returning Officer's office.",
    m1_timeline_3_e: "🔍 Scrutiny Day",
    m1_timeline_3_d: "Returning Officer examines all nomination papers.",
    m1_timeline_4_e: "🚪 Last Withdrawal",
    m1_timeline_4_d: "Candidates may withdraw before this deadline.",
    m1_timeline_5_e: "🎤 Campaign Period",
    m1_timeline_5_d: "Parties campaign under the Model Code of Conduct.",
    m1_timeline_6_e: "🗳️ Polling Day",
    m1_timeline_6_d: "Voters cast their secret ballot at the booth.",
    
    m1_scroll_desc: "The Election Commission of India (ECI) announces the poll schedule. Tap the scroll below to reveal the official election timeline.",
    m1_scroll_hint: "Tap the scroll to reveal the election timeline",
    m1_scroll_unroll: "Official Election Schedule",
    
    m1_nom_desc: "Candidates must file their papers. Identify the required documents from the candidates and drop them into the Returning Officer's tray.",
    m1_nom_affidavit: "Affidavit (Assets & Criminal Record)",
    m1_nom_deposit: "Security Deposit",
    m1_nom_ro: "Returning Officer",
    
    m1_man_desc: "Swipe left or right to see which actions are allowed during campaigning.",
    m1_man_1: "Building hospitals",
    m1_man_2: "Distributing cash",
    m1_man_3: "Promising free water",
    m1_man_4: "Organizing a rally",
    
    m1_mcc_desc: "Is this allowed under the Model Code of Conduct?",
    m1_mcc_q1: "A sitting Chief Minister uses a government helicopter for an election rally.",
    m1_mcc_q2: "A candidate promises to build a new school if elected.",
    m1_mcc_yes: "Allowed",
    m1_mcc_no: "Not Allowed",
    
    m1_recap_desc: "You've learned how elections are announced, how candidates are nominated, what manifestos promise, and which campaign actions are legal. Next: Voter Registration.",
    
    // Module 2
    m2_title: "Module 2: Voter Registration & ID",
    m2_s1_title: "Form 6 — New Voter",
    m2_s2_title: "Form 8 — Updates & Corrections",
    m2_s3_title: "SIR Verification",
    m2_s4_title: "Booth Finder",
    m2_s5_title: "Module Complete",
    
    m2_f6_desc: "Registering as a new voter requires Form 6. Drag the correct documents into the form slots.",
    m2_f6_doc1: "🖼️ Photo",
    m2_f6_doc2: "📅 Age Proof",
    m2_f6_doc3: "🏠 Address Proof",
    m2_f6_slot1: "Attach Photo",
    m2_f6_slot2: "Attach Age Proof",
    m2_f6_slot3: "Attach Address Proof",
    
    m2_f8_desc: "Use Form 8 to update your Voter ID. Select the correction type.",
    m2_f8_o1: "Shift of Residence",
    m2_f8_o2: "Correction of Entries",
    m2_f8_o3: "Replacement EPIC",
    
    m2_sir_desc: "A Booth Level Officer (BLO) visits your house to verify your Form 6 details.",
    m2_sir_verify: "Verify Identity",
    
    m2_booth_desc: "Enter your EPIC (Voter ID) number to find your polling booth.",
    m2_booth_placeholder: "Enter EPIC number (e.g., ABC1234567)",
    m2_booth_search: "Search",
    m2_booth_found: "Booth Found!",
    m2_booth_location: "Government High School, Room 4",
    
    m2_recap_desc: "You know how to register, update your details, complete verification, and find your polling booth. Next: Election Day!",
    
    // Module 3
    m3_title: "Module 3: Election Day at the Booth",
    m3_s1_title: "Entering the Station",
    m3_s2_title: "The Indelible Mark",
    m3_s3_title: "EVM & VVPAT Secret Ballot",
    m3_s4_title: "Module Complete",
    
    m3_enter_desc: "Drag the slider to walk into the polling booth.",
    m3_s1_desc: "Drag the slider to walk into the polling booth.",
    m3_enter_officer: "1st Polling Officer",
    m3_enter_check: "Identity Checked ✓",
    
    m3_ink_desc: "The 2nd Polling Officer marks your finger with indelible ink. Drag the ink bottle to the finger.",
    m3_s2_desc: "Before you vote, the Polling Officer applies indelible ink to your left index finger. This prevents double voting. Tap the ink bottle to apply the mark!",
    m3_ink_bottle: "Indelible Ink",
    
    m3_evm_desc: "Press the blue button next to your chosen candidate. Observe the VVPAT slip.",
    m3_s3_desc: "Inside the voting compartment, press the blue button next to your chosen candidate. The VVPAT window will show your paper slip for 7 seconds to verify.",
    m3_s3_instruction: "Press the blue button next to your chosen candidate.",
    m3_s3_voted: "Vote Recorded!",
    m3_evm_c1: "Vijay",
    m3_evm_c2: "Stalin",
    m3_evm_c3: "Palaniswami",
    m3_evm_vvpat: "VVPAT Slip",
    
    m3_recap_desc: "You've successfully cast your vote! Next: Counting Day and Results.",
    
    // Module 4
    m4_title: "Module 4: Post-Election & Results",
    m4_s1_title: "Sealing & The Strong Room",
    m4_s2_title: "Counting Day Operations",
    m4_s3_title: "The VVPAT Audit",
    m4_s4_title: "Winner Declaration",
    m4_s5_title: "Module Complete",
    
    m4_seal_desc: "After voting, EVMs are sealed and moved to the Strong Room. Tap the seal, then the wax, then drag the EVM.",
    m4_s1_desc: "Polls have closed. The EVM must be sealed and secured. Follow the steps to lock the machine and move it to the Strong Room.",
    m4_s1_tap_seal: "Tap Paper Seal",
    m4_s1_tap_wax: "Apply Wax",
    m4_s1_drag: "Drag to Strong Room",
    m4_seal_seal: "Paper Seal",
    m4_seal_wax: "Wax",
    m4_seal_room: "Strong Room",
    
    m4_count_desc: "Counting Day! Press the RESULT button to tally the votes.",
    m4_s2_desc: "It's Counting Day! The Returning Officer oversees the process. Press the RESULT button on the Control Unit to begin tallying votes round by round.",
    m4_count_btn: "RESULT",
    
    m4_vvpat_desc: "A mandatory VVPAT audit is conducted to ensure accuracy. Match the VVPAT count with the EVM count.",
    m4_s3_desc: "To build trust in results, 5 randomly-selected VVPAT boxes are opened. Tap any 5 boxes to audit them and confirm the paper slips match the electronic count.",
    m4_vvpat_evm: "EVM Count:",
    m4_vvpat_slip: "VVPAT Count:",
    m4_vvpat_match: "Match Confirmed!",
    
    m4_winner_desc: "The Returning Officer declares the winner and hands over the certificate.",
    m4_s4_desc: "The democracy has spoken! The Returning Officer hands the Certificate of Election to the winner. Drag the certificate to complete the process.",
    m4_winner_declare: "Declare Winner",
    m4_winner_cm: "Chief Minister Elect",
    
    m4_recap_desc: "You've completed the Election Odyssey! You now understand the full machinery behind Indian elections."
  },
  ta: {
    // Module 1
    m1_title: "தொகுதி 1: தேர்தலுக்கு முந்தைய மற்றும் பிரச்சாரம்",
    m1_s1_title: "அதிகாரப்பூர்வ அறிவிப்பு",
    m1_s2_title: "வேட்புமனு தாக்கல்",
    m1_s3_title: "பிரச்சாரம் மற்றும் தேர்தல் அறிக்கை",
    m1_s4_title: "தேர்தல் நடத்தை விதிகள்",
    m1_s5_title: "தொகுதி முடிந்தது",
    
    m1_timeline_1_e: "📢 அறிவிப்பு வெளியிடப்பட்டது",
    m1_timeline_1_d: "தேர்தல் ஆணையம் அதிகாரப்பூர்வமாக தேர்தல் அட்டவணையை அறிவிக்கிறது.",
    m1_timeline_2_e: "📝 வேட்புமனு திறப்பு",
    m1_timeline_2_d: "தேர்தல் நடத்தும் அதிகாரியிடம் வேட்பாளர்கள் மனு தாக்கல் செய்கிறார்கள்.",
    m1_timeline_3_e: "🔍 பரிசீலனை நாள்",
    m1_timeline_3_d: "அனைத்து வேட்புமனுக்களையும் அதிகாரி பரிசீலிக்கிறார்.",
    m1_timeline_4_e: "🚪 இறுதி திரும்பப் பெறுதல்",
    m1_timeline_4_d: "இந்த காலக்கெடுவுக்கு முன் வேட்பாளர்கள் விலகலாம்.",
    m1_timeline_5_e: "🎤 பிரச்சார காலம்",
    m1_timeline_5_d: "தேர்தல் நடத்தை விதிகளின் கீழ் கட்சிகள் பிரச்சாரம் செய்கின்றன.",
    m1_timeline_6_e: "🗳️ வாக்குப்பதிவு நாள்",
    m1_timeline_6_d: "வாக்காளர்கள் வாக்குச்சாவடியில் வாக்களிக்கின்றனர்.",
    
    m1_scroll_desc: "இந்தியத் தேர்தல் ஆணையம் (ECI) தேர்தல் அட்டவணையை அறிவிக்கிறது. அதிகாரப்பூர்வ அட்டவணையை காண கீழே உள்ள சுருளை தட்டவும்.",
    m1_scroll_hint: "தேர்தல் அட்டவணையை காண சுருளை தட்டவும்",
    m1_scroll_unroll: "அதிகாரப்பூர்வ தேர்தல் அட்டவணை",
    
    m1_nom_desc: "வேட்பாளர்கள் தங்கள் ஆவணங்களை தாக்கல் செய்ய வேண்டும். வேட்பாளர்களிடம் இருந்து தேவையான ஆவணங்களை அடையாளம் கண்டு அதிகாரியின் தட்டில் விடவும்.",
    m1_nom_affidavit: "பிரமாணப் பத்திரம் (சொத்து & குற்றப் பின்னணி)",
    m1_nom_deposit: "பாதுகாப்பு வைப்பு தொகை",
    m1_nom_ro: "தேர்தல் நடத்தும் அதிகாரி",
    
    m1_man_desc: "பிரச்சாரத்தின் போது அனுமதிக்கப்படும் செயல்களைக் காண இடது அல்லது வலது பக்கம் ஸ்வைப் செய்யவும்.",
    m1_man_1: "மருத்துவமனைகள் கட்டுதல்",
    m1_man_2: "பணம் விநியோகித்தல்",
    m1_man_3: "இலவச தண்ணீர் வழங்குதல்",
    m1_man_4: "பேரணி நடத்துதல்",
    
    m1_mcc_desc: "தேர்தல் நடத்தை விதிகளின் கீழ் இது அனுமதிக்கப்படுகிறதா?",
    m1_mcc_q1: "பதவியில் உள்ள முதலமைச்சர் தேர்தல் பிரச்சாரத்திற்கு அரசு ஹெலிகாப்டரைப் பயன்படுத்துகிறார்.",
    m1_mcc_q2: "தேர்ந்தெடுக்கப்பட்டால் புதிய பள்ளி கட்டுவதாக வேட்பாளர் உறுதியளிக்கிறார்.",
    m1_mcc_yes: "அனுமதிக்கப்படும்",
    m1_mcc_no: "அனுமதிக்கப்படாது",
    
    m1_recap_desc: "தேர்தல்கள் எவ்வாறு அறிவிக்கப்படுகின்றன, வேட்புமனு தாக்கல் செய்யப்படுவது, தேர்தல் அறிக்கைகள் மற்றும் சட்டப்பூர்வமான பிரச்சார நடவடிக்கைகள் எவை என்பதை நீங்கள் கற்றுக்கொண்டீர்கள். அடுத்து: வாக்காளர் பதிவு.",
    
    // Module 2
    m2_title: "தொகுதி 2: வாக்காளர் பதிவு & அடையாள அட்டை",
    m2_s1_title: "படிவம் 6 — புதிய வாக்காளர்",
    m2_s2_title: "படிவம் 8 — புதுப்பிப்புகள்",
    m2_s3_title: "SIR சரிபார்ப்பு",
    m2_s4_title: "வாக்குச்சாவடி கண்டுபிடிப்பான்",
    m2_s5_title: "தொகுதி முடிந்தது",
    
    m2_f6_desc: "புதிய வாக்காளராகப் பதிவு செய்ய படிவம் 6 தேவை. சரியான ஆவணங்களை படிவத்தில் இழுத்து விடவும்.",
    m2_f6_doc1: "🖼️ புகைப்படம்",
    m2_f6_doc2: "📅 வயதுச் சான்று",
    m2_f6_doc3: "🏠 முகவரிச் சான்று",
    m2_f6_slot1: "புகைப்படம் இணைக்கவும்",
    m2_f6_slot2: "வயதுச் சான்று இணைக்கவும்",
    m2_f6_slot3: "முகவரிச் சான்று இணைக்கவும்",
    
    m2_f8_desc: "உங்கள் வாக்காளர் அட்டையை புதுப்பிக்க படிவம் 8 ஐப் பயன்படுத்தவும். திருத்த வகையை தேர்ந்தெடுக்கவும்.",
    m2_f8_o1: "முகவரி மாற்றம்",
    m2_f8_o2: "விவரங்களில் திருத்தம்",
    m2_f8_o3: "மாற்று அடையாள அட்டை",
    
    m2_sir_desc: "வாக்குச்சாவடி நிலை அதிகாரி (BLO) உங்கள் படிவம் 6 விவரங்களை சரிபார்க்க உங்கள் வீட்டிற்கு வருகிறார்.",
    m2_sir_verify: "அடையாளத்தை சரிபார்க்கவும்",
    
    m2_booth_desc: "உங்கள் வாக்குச்சாவடியைக் கண்டறிய உங்கள் EPIC (வாக்காளர் அட்டை) எண்ணை உள்ளிடவும்.",
    m2_booth_placeholder: "EPIC எண்ணை உள்ளிடவும் (உ-ம்: ABC1234567)",
    m2_booth_search: "தேடு",
    m2_booth_found: "வாக்குச்சாவடி கண்டுபிடிக்கப்பட்டது!",
    m2_booth_location: "அரசு உயர்நிலைப் பள்ளி, அறை 4",
    
    m2_recap_desc: "பதிவு செய்வது, உங்கள் விவரங்களை புதுப்பிப்பது, சரிபார்ப்பை முடிப்பது மற்றும் வாக்குச்சாவடியைக் கண்டறிவது எப்படி என்பது உங்களுக்குத் தெரியும். அடுத்து: தேர்தல் நாள்!",
    
    // Module 3
    m3_title: "தொகுதி 3: வாக்குச்சாவடியில் தேர்தல் நாள்",
    m3_s1_title: "வாக்குச்சாவடிக்குள் நுழைதல்",
    m3_s2_title: "அழியா மை",
    m3_s3_title: "EVM & VVPAT ரகசிய வாக்குப்பதிவு",
    m3_s4_title: "தொகுதி முடிந்தது",
    
    m3_enter_desc: "எலெக்ட்ரானை வாக்குச்சாவடிக்குள் நடத்த ஸ்லைடரை இழுக்கவும்.",
    m3_s1_desc: "எலெக்ட்ரானை வாக்குச்சாவடிக்குள் நடத்த ஸ்லைடரை இழுக்கவும்.",
    m3_enter_officer: "1வது வாக்குப்பதிவு அதிகாரி",
    m3_enter_check: "அடையாளம் சரிபார்க்கப்பட்டது ✓",
    
    m3_ink_desc: "2வது வாக்குப்பதிவு அதிகாரி உங்கள் விரலில் அழியா மையை இடுகிறார். மை பாட்டிலை விரலுக்கு இழுக்கவும்.",
    m3_s2_desc: "2வது வாக்குப்பதிவு அதிகாரி உங்கள் விரலில் அழியா மையை இடுகிறார். மை பாட்டிலை விரலுக்கு இழுக்கவும்.",
    m3_ink_bottle: "அழியா மை",
    
    m3_evm_desc: "நீங்கள் தேர்ந்தெடுத்த வேட்பாளருக்குப் பக்கத்தில் உள்ள நீல நிற பட்டனை அழுத்தவும். VVPAT சீட்டைக் கவனிக்கவும்.",
    m3_s3_desc: "நீங்கள் தேர்ந்தெடுத்த வேட்பாளருக்குப் பக்கத்தில் உள்ள நீல நிற பட்டனை அழுத்தவும். VVPAT சீட்டைக் கவனிக்கவும்.",
    m3_s3_instruction: "நீங்கள் தேர்ந்தெடுத்த வேட்பாளருக்குப் பக்கத்தில் உள்ள நீல நிற பட்டனை அழுத்தவும்.",
    m3_s3_voted: "வாக்கு பதிவு செய்யப்பட்டது!",
    m3_evm_c1: "விஜய்",
    m3_evm_c2: "ஸ்டாலின்",
    m3_evm_c3: "பழனிசாமி",
    m3_evm_vvpat: "VVPAT சீட்டு",
    
    m3_recap_desc: "நீங்கள் வெற்றிகரமாக உங்கள் வாக்கை செலுத்திவிட்டீர்கள்! அடுத்து: வாக்கு எண்ணும் நாள் மற்றும் முடிவுகள்.",
    
    // Module 4
    m4_title: "தொகுதி 4: தேர்தலுக்குப் பிறகு & முடிவுகள்",
    m4_s1_title: "சீல் வைத்தல் & ஸ்ட்ராங் ரூம்",
    m4_s2_title: "வாக்கு எண்ணும் நாள்",
    m4_s3_title: "VVPAT தணிக்கை",
    m4_s4_title: "வெற்றியாளர் அறிவிப்பு",
    m4_s5_title: "தொகுதி முடிந்தது",
    
    m4_seal_desc: "வாக்குப்பதிவுக்குப் பிறகு, EVM-கள் சீல் வைக்கப்பட்டு ஸ்ட்ராங் ரூமிற்கு மாற்றப்படும். சீலையும் மெழுகையும் தட்டி, EVM-ஐ இழுக்கவும்.",
    m4_s1_desc: "வாக்குப்பதிவுக்குப் பிறகு, EVM-கள் சீல் வைக்கப்பட்டு ஸ்ட்ராங் ரூமிற்கு மாற்றப்படும். சீலையும் மெழுகையும் தட்டி, EVM-ஐ இழுக்கவும்.",
    m4_s1_tap_seal: "காகித சீலைத் தட்டவும்",
    m4_s1_tap_wax: "மெழுகு தடவவும்",
    m4_s1_drag: "ஸ்ட்ராங் ரூமிற்கு இழுக்கவும்",
    m4_seal_seal: "காகித சீல்",
    m4_seal_wax: "மெழுகு",
    m4_seal_room: "ஸ்ட்ராங் ரூம்",
    
    m4_count_desc: "வாக்கு எண்ணும் நாள்! வாக்குகளை எண்ண RESULT பட்டனை அழுத்தவும்.",
    m4_s2_desc: "வாக்கு எண்ணும் நாள்! வாக்குகளை எண்ண RESULT பட்டனை அழுத்தவும்.",
    m4_count_btn: "முடிவு",
    
    m4_vvpat_desc: "துல்லியத்தை உறுதி செய்ய கட்டாய VVPAT தணிக்கை நடத்தப்படுகிறது. VVPAT வாக்குகளை EVM வாக்குகளுடன் ஒப்பிடவும்.",
    m4_s3_desc: "துல்லியத்தை உறுதி செய்ய 5 VVPAT பெட்டிகள் தணிக்கை செய்யப்படுகின்றன. 5 பெட்டிகளைத் தட்டி, VVPAT வாக்குகளை EVM வாக்குகளுடன் ஒப்பிடவும்.",
    m4_vvpat_evm: "EVM வாக்குகள்:",
    m4_vvpat_slip: "VVPAT வாக்குகள்:",
    m4_vvpat_match: "பொருத்தம் உறுதிப்படுத்தப்பட்டது!",
    
    m4_winner_desc: "தேர்தல் நடத்தும் அதிகாரி வெற்றியாளரை அறிவித்து சான்றிதழை வழங்குகிறார்.",
    m4_s4_desc: "தேர்தல் நடத்தும் அதிகாரி வெற்றியாளரை அறிவித்து சான்றிதழை வழங்குகிறார். சான்றிதழை வெற்றியாளரிடம் இழுக்கவும்.",
    m4_winner_declare: "வெற்றியாளரை அறிவிக்கவும்",
    m4_winner_cm: "முதல்வர்",
    
    m4_recap_desc: "நீங்கள் தேர்தல் பயணத்தை முடித்துவிட்டீர்கள்! இந்தியத் தேர்தல்களுக்குப் பின்னணியில் உள்ள முழு வழிமுறையையும் இப்போது நீங்கள் புரிந்துகொண்டீர்கள்."
  }
} as const;
