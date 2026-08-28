import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const collectedAt = '2026-08-28';
const researchSource = 'Keywords Everywhere · United States · clickstream + Google Keyword Planner · 2026-08-28';

const topic = (keyword, title, slug, cluster, intent, funnel, volume, cpc, competition, audience, answer, focus, variants = []) => ({
  keyword, title, slug, cluster, intent, funnel, volume, cpc, competition, audience, answer, focus, variants,
});

const topics = [
  topic('earnest money deposit', 'Earnest Money Deposits: A Practical Guide for Real Estate Investors', 'earnest-money-deposit-guide', 'Earnest money', 'Learn', 'Awareness', 27100, 0.02, 0.06, 'Buyers and newer investors learning contract fundamentals', 'An earnest money deposit is money delivered under a purchase agreement to show that a buyer intends to perform. The contract controls when it is due, who holds it, when it is credited at closing, and when either party may claim it.', ['the deposit deadline and delivery method written in the contract', 'the escrow holder and release instructions', 'the contingencies and default language that determine whether funds are returned'], ['what is earnest money', 'emd real estate', 'good faith deposit real estate']),
  topic('is earnest money refundable', 'Is Earnest Money Refundable? Start With the Contract', 'is-earnest-money-refundable', 'Earnest money', 'Solve', 'Consideration', 1900, 0.03, 0.03, 'Buyers deciding whether a deposit is exposed', 'Earnest money may be refundable when a buyer terminates within a valid contingency or another contractual right. It may become nonrefundable after a deadline, waiver, or default. The signed agreement and applicable law—not a general rule—control the result.', ['which contingencies remain open', 'the exact notice and delivery requirements for termination', 'whether the parties dispute the escrow agent’s authority to release funds'], ['do you get earnest money back', 'can you get earnest money back']),
  topic('when is earnest money due', 'When Is Earnest Money Due in a Real Estate Deal?', 'when-is-earnest-money-due', 'Earnest money', 'Solve', 'Consideration', 480, 0.02, 0.03, 'Buyers and wholesalers managing a contract deadline', 'Earnest money is due when the purchase agreement says it is due. Some contracts require delivery with the offer; others allow a stated number of days after acceptance. Investors should calendar the precise deadline and confirm receipt in writing.', ['the event that starts the deadline', 'weekends, holidays, wire cutoffs, and delivery instructions', 'written confirmation from the closing or escrow professional'], ['when is emd due', 'earnest money deadline']),
  topic('what happens if earnest money is late', 'What Happens If Earnest Money Is Late?', 'what-happens-if-earnest-money-is-late', 'Earnest money', 'Solve', 'Decision', 0, 0, 0, 'Buyers facing a missed or uncertain deposit deadline', 'A late earnest money deposit can create a contract-default issue, weaken the buyer’s position, or give the seller rights described in the agreement. The outcome depends on the signed contract, local law, and what the parties do next.', ['whether the deadline actually expired', 'any notice-and-cure language', 'immediate communication with the closing professional and legal counsel'], ['late earnest money deposit', 'missed emd deadline']),
  topic('earnest money vs down payment', 'Earnest Money vs. Down Payment: What Changes and When?', 'earnest-money-vs-down-payment', 'Earnest money', 'Compare', 'Awareness', 320, 0.04, 0.03, 'Buyers separating contract deposits from acquisition capital', 'Earnest money is a contract deposit delivered before closing; a down payment is the buyer’s equity contribution to the purchase at closing. Earnest money is often credited toward closing funds, but the contract and settlement statement determine the treatment.', ['when each amount is paid', 'where the funds are held', 'how the deposit appears on the closing statement'], ['deposit vs down payment', 'down payment vs earnest money']),
  topic('option fee vs earnest money', 'Option Fee vs. Earnest Money: Two Different Contract Tools', 'option-fee-vs-earnest-money', 'Earnest money', 'Compare', 'Awareness', 90, 0, 0.02, 'Investors evaluating contract consideration and termination rights', 'An option fee generally purchases a defined contractual right, while earnest money is a deposit tied to performance under the purchase agreement. The names and legal effects vary by jurisdiction, so the document matters more than the label.', ['what right the fee purchases', 'whether either payment is refundable or credited', 'state-specific forms and deadlines'], ['what is option fee in real estate', 'earnest money and option fee']),
  topic('who holds earnest money', 'Who Holds Earnest Money Before Closing?', 'who-holds-earnest-money', 'Earnest money', 'Learn', 'Awareness', 110, 0, 0.03, 'Buyers who want to verify where deposit funds go', 'Earnest money is commonly held by a named escrow agent, title company, closing attorney, broker trust account, or another party authorized by the contract and local rules. A buyer should never assume wiring instructions are legitimate without independent verification.', ['the holder named in the signed agreement', 'fraud-resistant verification of wire instructions', 'the receipt and written escrow record'], ['where does earnest money go', 'who keeps earnest money before closing']),
  topic('when can seller keep earnest money', 'When Can a Seller Keep Earnest Money?', 'when-can-seller-keep-earnest-money', 'Earnest money', 'Solve', 'Consideration', 140, 0.02, 0.04, 'Investors assessing deposit-loss scenarios', 'A seller may have a claim to earnest money after a buyer default or another event defined in the contract. Whether the seller actually receives it can depend on notice, cure rights, escrow instructions, dispute procedures, and applicable law.', ['the default and liquidated-damages language', 'whether a valid contingency protected the buyer', 'the procedure the escrow holder must follow when parties disagree'], ['seller keeps earnest money', 'earnest money buyer default']),
  topic('earnest money commercial real estate', 'Earnest Money in Commercial Real Estate Deals', 'earnest-money-commercial-real-estate', 'Earnest money', 'Learn', 'Consideration', 30, 0, 0.05, 'Commercial buyers managing larger deposits and longer diligence', 'Commercial real estate deposits are negotiated deal terms that may change as due diligence progresses. Investors should model the amount, refundability, release schedule, extension rights, and closing conditions as part of the acquisition plan.', ['soft versus hard deposit milestones', 'due-diligence extensions and additional deposits', 'the liquidity cost of capital sitting in escrow'], ['commercial real estate earnest money deposit', 'cre emd']),

  topic('what is transactional funding', 'What Is Transactional Funding in Real Estate?', 'what-is-transactional-funding', 'Transactional funding', 'Learn', 'Awareness', 90, 0.26, 0.17, 'Wholesalers and investors comparing very short-term capital', 'Transactional funding is short-duration capital used to complete one closing when a related exit or second closing is expected shortly afterward. The funder evaluates the documents, title path, timing, and repayment source rather than treating it like long-term acquisition debt.', ['the A-B acquisition and B-C exit', 'control of closing funds and settlement statements', 'what happens if the second transaction is delayed or fails'], ['transactional lending real estate', 'same day transactional funding']),
  topic('assignment vs double close', 'Assignment vs. Double Close: How Wholesalers Choose', 'assignment-vs-double-close', 'Transactional funding', 'Compare', 'Consideration', 0, 0, 0, 'Wholesalers choosing a disposition structure', 'An assignment transfers contractual rights to an end buyer, while a double close uses two separate purchase transactions. The right structure depends on the contract, local rules, disclosure requirements, economics, title coordination, and the parties involved.', ['whether assignment is allowed and acceptable to the parties', 'the closing costs and funding needed for two settlements', 'required disclosures and professional guidance'], ['double closing vs assignment', 'assign contract or double close']),
  topic('double close timeline', 'A Double-Close Timeline From Contract to Two Settlements', 'double-close-timeline', 'Transactional funding', 'Learn', 'Decision', 0, 0, 0, 'Wholesalers coordinating an A-B and B-C closing', 'A double close requires two coordinated transactions: the original seller transfers to the investor, then the investor transfers to the end buyer. The title team, funder, contracts, settlement statements, and wire timing must align before either closing is treated as ready.', ['title and payoff work for the A-B closing', 'end-buyer funds and conditions for the B-C closing', 'wire cutoffs, recording order, and contingency time'], ['same day double close timeline', 'a b b c closing sequence']),
  topic('double close closing costs', 'What Costs Belong in a Double-Close Analysis?', 'double-close-closing-costs', 'Transactional funding', 'Learn', 'Consideration', 0, 0, 0, 'Wholesalers testing whether a double close still works', 'A double close can create costs on both transactions, including title or attorney charges, transfer or recording charges, transactional funding fees, wire fees, and other settlement items. The investor should model actual written estimates rather than a generic percentage.', ['two settlement statements instead of one', 'funding charges tied to amount and duration', 'tax, recording, title, and local transaction costs'], ['double closing fees', 'cost of a double close']),
  topic('transactional funding document checklist', 'Transactional Funding Document Checklist', 'transactional-funding-document-checklist', 'Transactional funding', 'Solve', 'Decision', 0, 0, 0, 'Borrowers preparing a fundable closing file', 'A complete transactional funding file usually starts with signed contracts, property and entity details, title or closing contacts, settlement timing, the exit transaction, and a clear repayment explanation. Every funder can require additional documentation.', ['fully executed A-B and B-C documents', 'entity, identity, title, and closing information', 'a concise sources-and-uses summary with the repayment event'], ['transactional funding requirements', 'double close funding documents']),
  topic('transactional funding vs hard money', 'Transactional Funding vs. Hard Money', 'transactional-funding-vs-hard-money', 'Transactional funding', 'Compare', 'Consideration', 0, 0, 0, 'Investors matching capital to a deal timeline', 'Transactional funding is designed for a very short, linked closing sequence. Hard money is generally acquisition or bridge debt held for a longer business plan. Comparing only the rate misses term length, fees, collateral, draws, recourse, and exit requirements.', ['the intended hold period', 'whether renovation or operating time is required', 'the all-in cost and consequences of an extension'], ['hard money vs transactional funding', 'transactional loan vs bridge loan']),
  topic('proof of funds real estate', 'Proof of Funds in Real Estate: What It Shows—and What It Does Not', 'proof-of-funds-real-estate', 'Transactional funding', 'Learn', 'Awareness', 480, 1.8, 0.17, 'Buyers and wholesalers preparing offers', 'Proof of funds is evidence that a buyer has access to money for a transaction. It does not replace underwriting, guarantee closing, or prove that every condition has been satisfied. Sellers and closing professionals may ask how the funds are controlled and used.', ['the amount and date shown', 'the institution or capital source behind the letter', 'whether the proof matches the buyer, property, and intended closing structure'], ['pof real estate', 'proof of funds letter real estate']),
  topic('a b c transaction real estate', 'A-B and B-C Real Estate Transactions Explained', 'abc-real-estate-transaction', 'Transactional funding', 'Learn', 'Awareness', 0, 0, 0, 'New wholesalers learning double-close terminology', 'In an A-B/B-C structure, A sells to B and B separately sells to C. Because B participates in two contracts and two settlements, the team must understand ownership, funding, disclosures, title, and the order in which each closing can occur.', ['separate contracts with compatible dates and obligations', 'how B acquires title before conveying it', 'the funding and recording sequence approved by the closing team'], ['a-b b-c transaction', 'abc double closing']),
  topic('wholesale real estate closing process', 'The Wholesale Real Estate Closing Process', 'wholesale-real-estate-closing-process', 'Transactional funding', 'Learn', 'Consideration', 0, 0, 0, 'Wholesalers moving from signed contract to disposition', 'A wholesale closing starts with a valid purchase agreement and moves through title review, buyer disposition, document preparation, funding, and settlement. The exact process changes when the contract is assigned versus when the investor completes a double close.', ['contract rights and assignment restrictions', 'title issues, liens, payoffs, and closing-party requirements', 'end-buyer readiness and the final settlement structure'], ['how wholesale deals close', 'real estate wholesaling closing']),

  topic('private money lending real estate', 'How Private Money Lending Works in Real Estate', 'private-money-lending-real-estate', 'Private lending', 'Learn', 'Awareness', 590, 6.42, 0.7, 'Borrowers and prospective private lenders learning the structure', 'Private money lending is a negotiated loan between a borrower and a private capital source, often secured by real estate and built around a specific business plan. Terms, underwriting, documentation, servicing, and remedies should be clear before funds move.', ['the borrower, property, use of funds, and repayment source', 'the note, security instrument, lien position, and title coverage', 'risk tolerance, servicing, reporting, and default procedures'], ['private real estate lending', 'how private lenders work']),
  topic('private money vs hard money', 'Private Money vs. Hard Money for Real Estate Investors', 'private-money-vs-hard-money', 'Private lending', 'Compare', 'Consideration', 90, 3.98, 0.16, 'Investors comparing capital sources', '“Private money” often describes capital from an individual or relationship-based lender, while “hard money” often describes an asset-based lending business. The labels overlap; investors should compare the actual term sheet, underwriting, fees, recourse, draws, and exit rules.', ['who controls and services the loan', 'how the property and borrower are underwritten', 'the complete economics and extension options'], ['hard money vs private lender', 'private lender vs hard money lender']),
  topic('how to present a deal to a private lender', 'How to Present a Real Estate Deal to a Private Lender', 'present-deal-to-private-lender', 'Private lending', 'Solve', 'Decision', 0, 0, 0, 'Borrowers seeking a clear capital conversation', 'A strong lender presentation explains the property, purchase basis, valuation support, budget, borrower experience, capital stack, risks, timeline, and repayment plan. It should make diligence easier without hiding what can go wrong.', ['a one-page deal summary backed by source documents', 'uses of funds and borrower cash in the transaction', 'base-case and downside exit scenarios'], ['private lender deal package', 'real estate funding pitch']),
  topic('private money loan documents', 'Private Money Loan Documents: A Borrower’s Checklist', 'private-money-loan-documents', 'Private lending', 'Solve', 'Decision', 10, 0, 0, 'Borrowers preparing for underwriting and closing', 'Private real estate loans require more than a handshake. The file may include an application, entity records, purchase contract, valuation, scope and budget, title work, insurance, a promissory note, security documents, guarantees, and closing instructions.', ['documents that establish the borrower and entity', 'documents that support value, budget, and exit', 'loan and collateral documents prepared for the jurisdiction'], ['private lender documents needed', 'private loan closing checklist']),
  topic('private money loan terms', 'Private Money Loan Terms Investors Should Compare', 'private-money-loan-terms', 'Private lending', 'Compare', 'Consideration', 10, 0, 0, 'Borrowers comparing term sheets', 'A private loan term sheet should be evaluated as a system: principal, interest, points and fees, term, payments, draws, reserves, collateral, lien position, recourse, extension rights, default terms, and exit requirements all affect the deal.', ['all-in cost rather than the stated rate alone', 'cash timing for fees, interest, and construction draws', 'extension, default, prepayment, and payoff mechanics'], ['private loan terms real estate', 'private lender term sheet']),
  topic('private money lending risks', 'Private Money Lending Risks: A Due-Diligence Framework', 'private-money-lending-risks', 'Private lending', 'Learn', 'Consideration', 10, 0, 0, 'Prospective lenders evaluating a real estate-backed loan', 'Private lending can expose capital to property, borrower, title, valuation, construction, market, servicing, legal, and liquidity risk. Collateral does not eliminate loss, and the lender may need time and money to enforce remedies.', ['independent valuation and conservative leverage', 'clear lien priority, title, insurance, and documentation', 'the borrower’s execution ability and a realistic repayment source'], ['risks of private lending', 'private mortgage investing risk']),
  topic('private lender vs equity partner', 'Private Lender vs. Equity Partner in a Real Estate Deal', 'private-lender-vs-equity-partner', 'Private lending', 'Compare', 'Consideration', 0, 0, 0, 'Capital providers choosing debt or ownership economics', 'A lender expects repayment under loan documents; an equity partner owns an interest and participates in results under an operating agreement. The return profile, control, tax treatment, downside, priority, and legal rights differ materially.', ['payment priority and participation in upside', 'decision rights and operational responsibility', 'tax, securities, and legal review appropriate to the structure'], ['debt vs equity real estate investing', 'private money partner vs lender']),
  topic('bridge loan vs hard money', 'Bridge Loan vs. Hard Money: Compare the Actual Structure', 'bridge-loan-vs-hard-money', 'Private lending', 'Compare', 'Consideration', 20, 0, 0.46, 'Investors financing a short business plan', 'Bridge loans and hard-money loans can both provide short-term real estate capital. “Bridge” describes the timing purpose; “hard money” often describes the underwriting model. A specific loan can be both, so the documents matter more than the category.', ['the event being bridged and expected payoff date', 'leverage, reserves, draws, and recourse', 'extension availability if the business plan takes longer'], ['hard money vs bridge loan', 'real estate bridge financing']),
  topic('gap funding real estate', 'What Is Gap Funding in Real Estate?', 'gap-funding-real-estate', 'Private lending', 'Learn', 'Consideration', 90, 6.81, 0.7, 'Investors filling a defined hole in the capital stack', 'Gap funding is supplemental capital used between the borrower’s available cash and the amount provided by a senior lender or other source. It may cover part of a down payment, closing costs, rehab, or another documented need, but it adds cost and structural complexity.', ['where the gap sits in the capital stack', 'whether the senior lender permits subordinate or outside capital', 'combined leverage and the repayment priority of each source'], ['real estate gap financing', 'second position funding']),
  topic('first lien vs second lien', 'First Lien vs. Second Lien in Real Estate Lending', 'first-lien-vs-second-lien', 'Private lending', 'Compare', 'Awareness', 210, 0, 0.01, 'Borrowers and lenders evaluating priority', 'Lien position generally affects payment priority against collateral. A first-position lien is ahead of a second-position lien, but priority can depend on recording, agreements, taxes, other claims, and local law. Position changes risk; it does not guarantee recovery.', ['the complete title and lien picture', 'intercreditor or subordination terms', 'combined leverage and downside value'], ['first position vs second position lien', 'junior lien real estate']),
  topic('promissory note vs deed of trust', 'Promissory Note vs. Deed of Trust', 'promissory-note-vs-deed-of-trust', 'Private lending', 'Compare', 'Awareness', 110, 0, 0.01, 'Borrowers learning core loan documents', 'A promissory note states the debt obligation and repayment terms. A deed of trust or mortgage creates a security interest in real property, subject to state law and proper execution and recording. They work together but do different jobs.', ['the payment promise in the note', 'the collateral rights in the security instrument', 'state-specific signing, notarization, and recording requirements'], ['note vs mortgage', 'deed of trust and promissory note']),
  topic('loan to cost vs loan to value', 'Loan-to-Cost vs. Loan-to-Value for Real Estate Deals', 'loan-to-cost-vs-loan-to-value', 'Private lending', 'Compare', 'Consideration', 110, 0.08, 0.09, 'Investors interpreting leverage limits', 'Loan-to-cost compares the loan to total project cost; loan-to-value compares it to a property value measure. A lender may constrain both. Investors should confirm which value, which costs, and which point in the project the calculation uses.', ['purchase price, rehab, and eligible cost definitions', 'as-is value versus completed or stabilized value', 'the lower leverage result when multiple limits apply'], ['ltc vs ltv real estate', 'loan to cost calculation']),
  topic('after repair value real estate', 'After-Repair Value: How Investors Should Use ARV', 'after-repair-value-real-estate', 'Private lending', 'Learn', 'Consideration', 10, 0, 0.02, 'Fix-and-flip investors and lenders reviewing completed value', 'After-repair value is an estimate of a property’s market value after a defined renovation is complete. It is only as reliable as the scope, comparable sales, adjustments, timing, and market assumptions behind it.', ['comparable properties that match the finished product', 'a rehab scope consistent with the assumed condition', 'sensitivity if price, timing, or scope changes'], ['arv real estate', 'how to calculate after repair value']),
  topic('dscr loan requirements', 'DSCR Loan Requirements: What Rental Investors Should Prepare', 'dscr-loan-requirements', 'Private lending', 'Learn', 'Decision', 2900, 2.77, 0.66, 'Rental investors preparing for lender screening', 'DSCR loan programs generally focus on whether property income supports required debt service, alongside credit, liquidity, property, entity, valuation, and program rules. Requirements differ by lender and scenario, so a current term sheet is essential.', ['rent and operating assumptions used in the DSCR calculation', 'credit, liquidity, reserves, and entity documentation', 'property eligibility, valuation, insurance, and prepayment terms'], ['debt service coverage ratio loan requirements', 'dscr mortgage requirements']),
  topic('dscr loan vs hard money', 'DSCR Loan vs. Hard Money for a Rental Property', 'dscr-loan-vs-hard-money', 'Private lending', 'Compare', 'Decision', 10, 0, 0, 'Investors choosing acquisition, rehab, or permanent rental capital', 'A DSCR loan is commonly used for stabilized rental debt based substantially on property cash flow. Hard money is commonly used for faster acquisition, renovation, or transition. The property’s current condition and the investor’s next milestone drive the fit.', ['whether the property is stabilized and producing supportable rent', 'the renovation and seasoning timeline', 'long-term payment, prepayment, and refinance economics'], ['hard money to dscr refinance', 'dscr vs bridge loan']),

  topic('real estate buy box', 'How to Build a Real Estate Buy Box That Improves Decisions', 'real-estate-buy-box', 'Deal analysis', 'Solve', 'Consideration', 70, 4.19, 0.09, 'Investors and wholesalers defining acquisition criteria', 'A real estate buy box is a written set of acquisition criteria that helps a team reject weak opportunities quickly and evaluate promising ones consistently. It should connect market, property, price, condition, strategy, return, risk, and financing.', ['markets, neighborhoods, property types, and physical limits', 'purchase basis, rehab tolerance, and return thresholds', 'deal breakers, evidence standards, and who can approve exceptions'], ['real estate buy box template', 'investment property buy box']),
  topic('how to analyze a real estate deal', 'How to Analyze a Real Estate Deal Before You Commit', 'analyze-real-estate-deal', 'Deal analysis', 'Learn', 'Consideration', 50, 1.88, 0.4, 'Investors building a repeatable underwriting process', 'A useful deal analysis connects purchase price, condition, financing, operating income, expenses, timeline, exit value, transaction costs, and downside cases. The point is not to make a spreadsheet look precise; it is to expose the assumptions that control the outcome.', ['source documents for price, rent, expenses, and condition', 'capital needs and timing from contract through exit', 'base, downside, and break-even scenarios'], ['real estate deal analysis', 'underwrite investment property']),
  topic('fix and flip deal analysis', 'Fix-and-Flip Deal Analysis: From Purchase to Net Proceeds', 'fix-and-flip-deal-analysis', 'Deal analysis', 'Solve', 'Decision', 0, 0, 0, 'Flippers checking margin before closing', 'A fix-and-flip analysis should model acquisition, financing, renovation, carrying costs, selling costs, schedule, and a defensible resale value. A healthy-looking gross spread can disappear when time, scope, or disposition assumptions move.', ['a detailed scope with labor, materials, permits, and contingency', 'monthly carry and financing costs across a realistic schedule', 'net sale proceeds after commissions, concessions, taxes, and payoff'], ['house flipping deal analysis', 'fix and flip calculator assumptions']),
  topic('wholesale real estate deal analysis', 'Wholesale Deal Analysis: What Makes a Contract Marketable?', 'wholesale-real-estate-deal-analysis', 'Deal analysis', 'Solve', 'Decision', 0, 0, 0, 'Wholesalers screening contracts before disposition', 'A wholesale deal is marketable when an end buyer can verify a credible spread after purchase, repairs, financing, holding, and resale or rental assumptions. Wholesalers should underwrite for the buyer’s economics, not only the desired assignment fee.', ['clear contract rights and access for diligence', 'defensible condition, repair, value, and rent evidence', 'enough margin for the end buyer after every material cost'], ['analyze wholesale deal', 'wholesale property numbers']),
  topic('rental property analysis', 'Rental Property Analysis Beyond the Monthly Rent', 'rental-property-analysis', 'Deal analysis', 'Learn', 'Consideration', 170, 2.62, 0.41, 'Buy-and-hold investors comparing opportunities', 'Rental property analysis should include realistic collected rent, vacancy, operating expenses, reserves, financing, capital expenditures, management, and exit assumptions. Gross rent alone does not show cash flow or risk.', ['market rent supported by comparable leases or current operations', 'full operating expenses and replacement reserves', 'debt service, liquidity needs, and downside occupancy'], ['analyzing a rental property', 'rental property underwriting']),
  topic('cap rate vs cash on cash return', 'Cap Rate vs. Cash-on-Cash Return', 'cap-rate-vs-cash-on-cash-return', 'Deal analysis', 'Compare', 'Awareness', 260, 0.05, 0.07, 'Investors comparing property performance metrics', 'Cap rate compares net operating income with property value before financing. Cash-on-cash return compares annual pre-tax cash flow with the cash invested. They answer different questions and can move in different directions when leverage changes.', ['a consistent net operating income calculation', 'the actual cash invested at acquisition and stabilization', 'how financing changes cash flow without changing property operations'], ['cash on cash vs cap rate', 'cap rate and coc return']),
  topic('70 percent rule real estate', 'The 70% Rule in Real Estate: Screen, Then Underwrite', '70-percent-rule-real-estate', 'Deal analysis', 'Learn', 'Awareness', 30, 0.04, 0.29, 'New investors learning quick deal screens', 'The 70% rule is a rough fix-and-flip screening heuristic, not a complete offer formula. Market conditions, financing, scope, selling costs, taxes, hold time, and required profit can make the shortcut too aggressive or too conservative.', ['the assumptions hidden inside the percentage', 'local resale and transaction-cost conditions', 'a full project model before making a binding commitment'], ['70 rule house flipping', 'seventy percent rule real estate']),
  topic('real estate due diligence checklist', 'Real Estate Due Diligence Checklist for Investors', 'real-estate-due-diligence-checklist', 'Deal analysis', 'Solve', 'Decision', 210, 0.51, 0.07, 'Investors organizing a contract review period', 'Investor due diligence should connect title, survey, zoning and use, physical condition, environmental issues, leases, income, expenses, insurance, financing, entity, contracts, and the exit plan. The right checklist changes by property and jurisdiction.', ['legal and title rights to acquire and operate the property', 'physical and financial facts that support the underwriting', 'closing conditions, financing, insurance, and a documented go/no-go decision'], ['investment property due diligence', 'real estate acquisition checklist']),
  topic('real estate exit strategy', 'Real Estate Exit Strategies: Choose Before You Close', 'real-estate-exit-strategy', 'Deal analysis', 'Learn', 'Consideration', 90, 1.85, 0.05, 'Investors matching acquisition terms to an outcome', 'An exit strategy explains how capital is repaid and value is realized: sale, assignment, refinance, stabilization, long-term hold, or another documented path. Strong deals also define a fallback when the preferred exit is delayed or unavailable.', ['the primary exit and the evidence supporting it', 'the capital and time needed to reach that exit', 'one or more fallback paths with trigger points'], ['exit strategies real estate investing', 'real estate investment exit plan']),
  topic('co living investment property', 'Co-Living as an Investment Property Strategy', 'co-living-investment-property', 'Deal analysis', 'Learn', 'Consideration', null, null, null, 'Rental investors evaluating room-based housing operations', 'Co-living can increase gross revenue by renting private rooms with shared common areas, but it also changes management, turnover, utilities, furnishing, parking, occupancy, licensing, insurance, and resident-experience requirements. The operating model must fit the property and local rules.', ['local occupancy, zoning, leasing, and licensing constraints', 'room-level demand and operating workload', 'utilities, furnishing, management, turnover, and common-area costs'], ['co living real estate investing', 'rent by the room investment']),

  topic('creative financing real estate', 'Creative Financing in Real Estate: Start With the Problem', 'creative-financing-real-estate', 'Creative acquisition', 'Learn', 'Awareness', 110, 3.53, 0.52, 'Buyers and sellers exploring alternatives to a standard sale', 'Creative financing is a broad term for transaction structures that change how price, debt, equity, payments, control, or timing work. A useful structure solves a specific constraint while making risk and responsibility understandable to every party.', ['the seller’s goals and the buyer’s operating plan', 'existing debt, title, insurance, taxes, and transfer restrictions', 'payments, maturity, default, exit, and professional review'], ['creative financing examples', 'creative finance loans']),
  topic('seller financing real estate', 'Seller Financing in Real Estate: Terms Both Sides Should Understand', 'seller-financing-real-estate', 'Creative acquisition', 'Learn', 'Consideration', 720, 0.56, 0.21, 'Buyers and sellers evaluating an installment structure', 'In seller financing, the seller extends credit for some or all of the purchase price under negotiated documents. Price, down payment, interest, amortization, balloon, collateral, servicing, default, taxes, insurance, and transfer timing should be explicit.', ['the payment schedule and maturity or balloon', 'the security instrument and lien position', 'servicing, insurance, taxes, default, and early payoff rules'], ['owner financing real estate', 'creative seller financing']),
  topic('subject to real estate', 'Subject-To Real Estate: What the Structure Actually Means', 'subject-to-real-estate', 'Creative acquisition', 'Learn', 'Consideration', 1600, 2.56, 0.2, 'Investors and sellers learning an existing-financing acquisition', 'A subject-to acquisition transfers title while an existing loan remains in place in the seller’s name. The structure can create significant contractual, servicing, insurance, tax, due-on-sale, disclosure, and exit risks that require qualified legal review.', ['the existing loan documents and due-on-sale risk', 'title transfer, insurance, taxes, payment servicing, and records', 'seller protection and the buyer’s refinance or payoff plan'], ['buying a house subject to', 'subject 2 real estate']),
  topic('subject to vs seller financing', 'Subject-To vs. Seller Financing', 'subject-to-vs-seller-financing', 'Creative acquisition', 'Compare', 'Consideration', 0, 0, 0, 'Buyers and sellers comparing creative structures', 'Subject-to typically leaves an existing third-party loan in place after title transfers. Seller financing creates a new debt obligation from buyer to seller. They can sometimes appear in the same capital stack, but their risks and documents are different.', ['who is owed money after closing', 'which existing or new liens remain on the property', 'payment servicing, maturity, default, insurance, and exit obligations'], ['seller finance vs subject to', 'subject to and owner financing']),
  topic('brrrr method', 'The BRRRR Method: Underwrite Every Transition', 'brrrr-method-real-estate', 'Creative acquisition', 'Learn', 'Awareness', 8100, 0.03, 0.16, 'Investors planning buy-rehab-rent-refinance-repeat projects', 'BRRRR stands for buy, rehab, rent, refinance, repeat. The strategy depends on moving successfully through several different risk stages, so acquisition basis, construction, lease-up, valuation, seasoning, and refinance requirements must align.', ['the acquisition and renovation capital through stabilization', 'rent, operating expenses, and completed value', 'refinance eligibility, proceeds, timing, and cash left in the deal'], ['buy rehab rent refinance repeat', 'brrrr real estate strategy']),
  topic('short term vs long term rental', 'Short-Term vs. Mid-Term vs. Long-Term Rental Strategy', 'short-mid-long-term-rental', 'Creative acquisition', 'Compare', 'Consideration', 320, 0.07, 0.09, 'Owners choosing an operating model for a property', 'Short-term, mid-term, and long-term rentals create different demand, turnover, furnishing, management, regulatory, financing, and vacancy profiles. The better model depends on the property, market, rules, capital plan, and the operator’s capacity.', ['local demand, seasonality, and occupancy assumptions for each stay length', 'regulation, insurance, financing, utilities, furnishing, and lease requirements', 'management workload and full operating costs'], ['airbnb vs long term rental', 'short term rental or long term rental', 'mid term rental strategy']),
  topic('creative finance deal structure checklist', 'Creative-Finance Deal Structure Checklist', 'creative-finance-deal-structure-checklist', 'Creative acquisition', 'Solve', 'Decision', null, null, null, 'Dealmakers preparing a structured acquisition for review', 'A creative-finance deal should be understandable on one page before documents are drafted: parties, property, price, existing debt, new debt or equity, cash at closing, payments, control, responsibilities, maturity, default, and exits.', ['a complete capital stack and sources-and-uses table', 'who owns, owes, controls, insures, maintains, and pays', 'maturity, default, transfer, refinance, sale, and fallback paths'], ['creative finance checklist', 'structure seller finance deal']),
];

if (topics.length !== 50) throw new Error(`Expected 50 topics, found ${topics.length}`);

const clusterConfig = {
  'Earnest money': {
    ctaLabel: 'Discuss an EMD scenario', ctaHref: '/emd-lending', businessValue: 5,
    context: 'Deposits look simple until a deadline, contingency, or release becomes disputed. The useful analysis begins with the executed agreement and the professionals responsible for escrow and closing.',
    evidence: 'Review the signed contract, current state-specific forms or commission guidance, and written instructions from the closing attorney, title company, or escrow holder.',
  },
  'Transactional funding': {
    ctaLabel: 'Submit a transactional funding request', ctaHref: '/emd-lending', businessValue: 5,
    context: 'Very short-term capital only works when the documents, title path, closing sequence, and repayment event all agree. Speed is valuable after the structure is clear.',
    evidence: 'Review executed A-B and B-C agreements, title and closing correspondence, settlement statements, entity documents, and the funder’s current written terms.',
  },
  'Private lending': {
    ctaLabel: 'Discuss a private-money request', ctaHref: '/private-money-lenders', businessValue: 5,
    context: 'Private capital can be flexible, but flexibility should create clearer documentation—not less of it. Borrower, property, collateral, repayment, servicing, and downside all belong in the same conversation.',
    evidence: 'Use current term sheets, title and lien reports, valuation support, insurance, entity records, loan documents, and advice from qualified legal and tax professionals.',
  },
  'Deal analysis': {
    ctaLabel: 'Review a real estate opportunity', ctaHref: '/contact', businessValue: 4,
    context: 'Good underwriting is a decision system, not a single formula. It makes assumptions visible, connects them to evidence, and shows how the result changes when price, time, scope, income, or financing moves.',
    evidence: 'Use current contracts, comparable sales or leases, inspection and contractor information, taxes, insurance, operating records, financing terms, and local regulatory sources.',
  },
  'Creative acquisition': {
    ctaLabel: 'Discuss an acquisition structure', ctaHref: '/contact', businessValue: 4,
    context: 'Creative structures are useful when they solve a real constraint for the parties. They are dangerous when labels replace documentation or when the exit depends on assumptions no one has verified.',
    evidence: 'Review title, existing debt, insurance, tax, entity, operating, and transaction documents with qualified counsel before relying on a creative-finance structure.',
  },
};

const publicationDates = [];
let cursor = new Date('2026-09-08T12:00:00Z');
while (publicationDates.length < topics.length) {
  const day = cursor.getUTCDay();
  if (day === 2 || day === 4) publicationDates.push(cursor.toISOString().slice(0, 10));
  cursor.setUTCDate(cursor.getUTCDate() + 1);
}

const priorityFor = (item) => {
  const config = clusterConfig[item.cluster];
  const demand = item.volume === null ? 0 : Math.min(5, Math.log10(item.volume + 1));
  const commercial = item.cpc === null ? 0 : Math.min(2, item.cpc / 4);
  const score = Math.round((config.businessValue * 2 + demand + commercial) * 10) / 10;
  return { score, tier: score >= 13 ? 'P1' : score >= 10.5 ? 'P2' : 'P3' };
};

const yaml = (value) => JSON.stringify(value);
const safeDescription = (text) => text.length <= 158 ? text : `${text.slice(0, 155).replace(/\s+\S*$/, '')}…`;

const articleBody = (item, index) => {
  const config = clusterConfig[item.cluster];
  const date = publicationDates[index];
  const metric = item.volume === null
    ? 'This topic was retained for direct business fit but was not measured in the capped keyword pass.'
    : item.volume === 0
      ? 'Keywords Everywhere reported zero U.S. monthly searches. That is a measured result, not proof that nobody searches for the topic.'
      : `Keywords Everywhere estimated ${item.volume.toLocaleString('en-US')} U.S. searches per month when collected on August 28, 2026.`;
  const questions = item.focus.map((point) => `- What evidence supports **${point}**?`).join('\n');
  const review = item.focus.map((point, pointIndex) => `### ${pointIndex + 1}. ${point.charAt(0).toUpperCase()}${point.slice(1)}\n\nWrite the answer into the deal file and attach the source document. If the answer depends on a verbal promise, future approval, or an unverified estimate, treat it as an open condition rather than a completed fact.`).join('\n\n');
  return `---
title: ${yaml(item.title)}
description: ${yaml(safeDescription(item.answer))}
plannedPublishDate: ${yaml(date)}
targetKeyword: ${yaml(item.keyword)}
cluster: ${yaml(item.cluster)}
intent: ${yaml(item.intent)}
funnel: ${yaml(item.funnel)}
audience: ${yaml(item.audience)}
ctaLabel: ${yaml(config.ctaLabel)}
ctaHref: ${yaml(config.ctaHref)}
volume: ${item.volume === null ? 'null' : item.volume}
cpc: ${item.cpc === null ? 'null' : item.cpc}
competition: ${item.competition === null ? 'null' : item.competition}
researchSource: ${yaml(item.volume === null ? 'Business-fit topic · metric not queried in capped pass · 2026-08-28' : researchSource)}
status: "drafted"
draft: true
reviewRequired: true
---

> **Editorial status:** Complete working draft. Keep unpublished until a human verifies the legal, lending, tax, and state-specific details for the intended audience.

## Short answer

${item.answer}

## Why this matters in a real deal

${config.context}

For ${item.audience.toLowerCase()}, the practical question is not only “what does this term mean?” It is “which decision does it change, which document controls that decision, and what happens if the expected path fails?” That framing keeps education connected to the actual transaction without pretending that one article can replace underwriting or professional advice.

${metric} Search volume is an estimate and paid-search competition is not organic ranking difficulty. The topic belongs in this plan because its search intent is distinct and it supports a verified Fran Legacy conversation.

## Three points to verify

${review}

## A practical review sequence

1. **Name the decision.** Write down what must be decided, who has authority, and the deadline created by the contract or business plan.
2. **Collect the controlling documents.** Use signed agreements, title and closing records, written term sheets, current property evidence, and official sources. Do not rely on a screenshot or a summary when the original is available.
3. **Map the money and timing.** Show every material source and use of funds, when cash moves, who controls it, and the event expected to repay or release it.
4. **Model the downside.** Test a delay, a lower value, a larger scope, weaker income, or a failed exit. Identify which party absorbs the change.
5. **Resolve open conditions.** Assign each unanswered question to the borrower, lender, closing professional, contractor, insurance adviser, accountant, or attorney who can verify it.

## Questions to put in writing

${questions}
- Which assumption would change the decision fastest if it proved wrong?
- What is the fallback if the preferred closing, financing, or operating plan is delayed?

## Common mistakes

- Comparing labels instead of comparing the actual contracts, term sheets, settlement statements, and responsibilities.
- Treating an estimated value, rent, cost, timeline, or approval as if it were already verified.
- Focusing on the best-case return without mapping liquidity needs, extension risk, default consequences, and transaction costs.
- Waiting until the funding deadline to involve the title company, closing attorney, insurance professional, or lender.

## Source and review plan

${config.evidence}

This draft intentionally avoids quoting Fran Legacy rates, fees, approval standards, lending territory, closing speed, or expected investor returns. Those details require written owner confirmation and, where appropriate, legal or compliance review before publication.

## Next step

Turn the analysis into a one-page deal summary: property, parties, contract dates, capital needed, use of funds, supporting value, risks, and primary and fallback exits. Fran Legacy can then decide whether the opportunity fits a funding, acquisition, or consulting conversation.

[${config.ctaLabel}](${config.ctaHref})
`;
};

await mkdir(path.join(root, 'src/content/blog'), { recursive: true });
await mkdir(path.join(root, 'seo'), { recursive: true });

const queue = topics.map((item, index) => {
  const config = clusterConfig[item.cluster];
  const priority = priorityFor(item);
  return {
    id: index + 1,
    keyword: item.keyword,
    title: item.title,
    slug: item.slug,
    cluster: item.cluster,
    intent: item.intent,
    funnel: item.funnel,
    audience: item.audience,
    cta: config.ctaLabel,
    ownerUrl: `/blog/${item.slug}/`,
    pageType: 'article',
    status: 'Drafted',
    plannedPublishDate: publicationDates[index],
    volume: item.volume,
    cpc: item.cpc,
    competition: item.competition,
    researchSource: item.volume === null ? 'Business-fit topic · metric not queried in capped pass · 2026-08-28' : researchSource,
    priority: priority.tier,
    priorityScore: priority.score,
    brief: {
      shortAnswer: item.answer,
      mustCover: item.focus,
      humanReview: 'Verify legal, tax, lending, securities, state-specific, and Fran Legacy product details before publication.'
    }
  };
});

const state = Object.fromEntries(queue.map((item) => [item.slug, {
  id: item.id,
  keyword: item.keyword,
  slug: item.slug,
  status: 'drafted',
  articlePath: `src/content/blog/${item.slug}.md`,
  draftedAt: collectedAt,
  plannedPublishDate: item.plannedPublishDate,
  approvedAt: null,
  publishedAt: null,
  verifiedLiveAt: null,
}]));

const variationMap = Object.fromEntries(topics.map((item) => [item.keyword, {
  ownerUrl: `/blog/${item.slug}/`,
  variants: item.variants,
}]));

const research = {
  collectedAt,
  country: 'United States',
  currency: 'USD',
  dataSource: 'Keywords Everywhere clickstream + Google Keyword Planner',
  creditsUsedThisPass: 498,
  notes: [
    'Null metrics were not queried during the capped research pass.',
    'Zero is a measured value and is not proof of zero demand.',
    'Competition is paid-ad competition, not organic SEO difficulty.',
    'Commercial lender intent is stored separately in seo/competitor-research.json and is not inflated into the 50-post article count.'
  ],
  items: queue.map(({ keyword, volume, cpc, competition, researchSource, priority, priorityScore }) => ({ keyword, volume, cpc, competition, researchSource, priority, priorityScore })),
};

await Promise.all([
  writeFile(path.join(root, 'seo/keyword-seeds.json'), `${JSON.stringify(queue, null, 2)}\n`),
  writeFile(path.join(root, 'seo/content-state.json'), `${JSON.stringify(state, null, 2)}\n`),
  writeFile(path.join(root, 'seo/keyword-variation-map.json'), `${JSON.stringify(variationMap, null, 2)}\n`),
  writeFile(path.join(root, 'seo/keywords-everywhere-research.json'), `${JSON.stringify(research, null, 2)}\n`),
  ...topics.map((item, index) => writeFile(path.join(root, `src/content/blog/${item.slug}.md`), articleBody(item, index))),
]);

console.log(`Generated ${topics.length} SEO drafts and research workflow files.`);
