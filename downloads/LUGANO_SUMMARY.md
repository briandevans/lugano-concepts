# Lugano — Full Project & Site Summary

**Brand:** Lugano (`lugano.ai`)
**Token:** `$LUG` (scarce) · **Credit:** `$LIC` (USD-denominated inference credit)
**Status:** Protocol design / research preview. Not a live network. Not a token offering.
**Date:** 22 August 2026
**Repo / PR:** https://github.com/briandevans/lugano-concepts/pull/12

This document is the single explainer for the whole project: the research, the product, the privacy model, the tokenomics, how users earn, and how the website is put together.

---

## 1. One-liner

**Private inference anyone can buy. Idle compute anyone can sell. Access anyone can resell — without revealing the buyer, the seller, or the prompt.**

`$LUG` exists so that real usage has to **bid** for the token, **lock** the token, and **burn** the token.

---

## 2. Why this exists

Centralized APIs (OpenAI, Anthropic, Google) see prompts. That is unacceptable for source code, medical notes, legal files, trading context, and a lot of agent traffic.

Two live projects already attack that problem, from different angles:

### Darkbloom (https://www.darkbloom.dev/)

Eigen / Layr Labs. Routes encrypted jobs to **idle Apple Silicon Macs**. The actual product is not “decentralized GPUs.” It is:

> The person who owns the machine has root and physical custody — and still must not be able to read the prompt.

Four layers: client-side encryption, keys born in Apple’s Secure Enclave, a hardened runtime that blocks debuggers and memory inspection, signed receipts chained to Apple’s CA. OpenAI-compatible API. About **50% cheaper** than typical hosted rates because the hardware is already paid for. Operators get most of the fee. **No token. Mac-only. No way to resell unused access.**

### Dolphin (https://dphn.ai/network)

Distributed inference on **idle consumer / datacenter GPUs**. Peer-to-pool (join and leave anytime — unlike Akash or io.net reservations). Node operators earn **`$POD`**. Optional **bonds** for a reward boost and slash risk. Privacy is E2EE + no logs + encrypted/signed binaries + sampled logprob checks.

Encrypted binaries are **not** operator-blind. A determined host with a debugger is a different threat than a Secure Enclave. **No private secondary market** for access. `$POD` demand is mostly “earn and sell” unless buyers are forced through the token.

### Other DeAI / compute tokens

| Project | What they actually sell | Privacy | Token lesson |
| --- | --- | --- | --- |
| Phala / TEE clouds | Enclave inference | Strong attestations | More centralized inventory |
| io.net, Nosana, Spheron | Raw GPU hours | Generally none | Emissions pay GPUs; GPUs dump |
| Akash (`$AKT`) | General compute | None | 2026 **burn-mint equilibrium** is the right *settlement* pattern |
| Bittensor (`$TAO`) | Intelligence markets | None | Not a private session product |
| Gensyn (`$AI`) | Verifiable training | N/A here | Different control point |
| Nillion (`$NIL`) | Blind / secret compute | Different stack | Not a GPU mesh |

**The gap nobody ships:** a sealed secondary market for **attested** inference access. That is Lugano’s wedge.

If you omit sealed resale, this is a Darkbloom/Dolphin reskin. If resale includes third-party OpenAI/Anthropic keys, it is fraud. The only legal object of resale is **Lugano-attested compute** and **first-party `$LIC`**.

---

## 3. Product

Three roles. One mesh.

### 3.1 Infer — consume private inference

Swap the OpenAI base URL to `https://api.lugano.ai/v1`. The SDK seals the prompt to the selected provider’s attested public key before the request leaves the app. Pay in USDC or `$LUG`. Designed for developers and agents who will not send sensitive context to a hosted API.

### 3.2 Provide — sell idle compute

Run a worker on a Mac, a Linux GPU box, or a TEE host. Peer-to-pool: leave when you need the GPU back. You are paid for **completed, attested** jobs, not raw uptime. Bond `$LUG` for priority routing. **82%** of each primary job goes to the node. Optional **5% bonus** if you take settlement in `$LUG` instead of cashing out.

### 3.3 Relay — privately resell access

This is the unique surface.

A relay lists unused **`$LIC`**, spare **node hours**, or **veLUG priority windows**. Matching is identity-blind. The relay sells a **sealed capability**, not a decrypted session. They never see the prompt. Settlement reveals model, token count, and price only.

Rules:

- Bond **150%** of listed inventory in `$LUG` (90-day cooldown after delist)
- **2.5% of every fill burns**
- Leak or non-delivery: **50% of the bond burns**, 50% paid to the reporter
- First-party compute only

Relays earn the protocol’s **6% relay share** plus whatever spread they quote.

### Who this is not for

- Anyone who needs a 99.99% regional SLA tomorrow (stay on Azure / Bedrock)
- Anyone who just wants uncensored local models (run llama.cpp)
- Anyone who wants to arbitrage foundation-model API keys

---

## 4. Privacy model (precise claims)

Same honesty bar as Darkbloom. Marketing slogans that cannot be checked are rejected.

### Four layers

1. **Client-sealed requests.** Prompt is encrypted to the provider’s attested key. The router sees ciphertext, model id, and a token budget — not the text.
2. **Hardware-bound keys.** Keys are born inside Apple Secure Enclave, NVIDIA Confidential Computing, or Intel/AMD TEE. The attestation chain is public and roots in the vendor CA. A home operator cannot export the key.
3. **Hardened runtime.** Debugger attach, memory inspection, and host logging are blocked. Enabling prompt logs drops the node from the mesh.
4. **Signed receipts.** Every response is signed by the machine that produced it. Buyers and auditors can verify hardware without seeing the prompt.

### What we claim, and what we do not

| Claim | Status | Note |
| --- | --- | --- |
| The Mac / GPU owner cannot read your prompt | Design target | True only if attestation, sealed keys, and the hardened runtime all hold |
| The coordinator never sees plaintext | **Not the claim** | Like Darkbloom, a coordinator CVM may briefly see plaintext while re-sealing. It is never logged or retained |
| Relays cannot read jobs they resell | Design target | They sell a sealed capability. Settlement shows model, tokens, price |
| You can resell OpenAI or Anthropic keys | **Forbidden** | Out of scope |

### Architecture (design)

```
client SDK
  └─ encrypts prompt to provider attested pubkey
coordinator CVM
  └─ routes ciphertext, may re-seal, never logs
attested worker (SE / CC / TDX)
  └─ decrypts in hardened process, signs receipt
optional relay
  └─ sells sealed capability, never holds plaintext
settlement
  └─ LIC burn, LUG remint / fee / relay spread
```

Verification is a mix, not a single trick:

- Hardware attestation (Darkbloom-grade) as the **privacy** root
- Sampled output checks + bonds (Dolphin-grade) as the **quality** root
- Peer-to-pool scheduling so consumer GPUs can come and go

---

## 5. Tokenomics

Most DeAI tokens fail the same way: they mint to pay GPUs, GPUs dump, there is no privacy premium, and there is only one demand loop.

Lugano’s answer: operator-blind inference + idle hardware + **burn-mint credits** (Akash BME) + a **sealed access market that must be overcollateralized in `$LUG`**.

### 5.1 Two assets

- **`$LUG`** — scarce coordination token. Staked, burned, governed.
- **`$LIC`** — USD-denominated inference credit. Minted only by vaulting or burning LUG. Not a speculative float. Users think in dollars; value still routes through LUG.

### 5.2 Supply

**Hard cap: 100,000,000 LUG.** After year 8, no inflation. Rewards become fee-funded.

| Bucket | % | Amount | Unlock |
| --- | ---: | ---: | --- |
| Network rewards | 38 | 38,000,000 | 8-year decaying epochs (providers, relays, attesters) |
| Team | 14 | 14,000,000 | 12-month cliff, 48-month vest. **No TGE unlock** |
| Treasury / grants | 12 | 12,000,000 | DAO-gated, 4-year linear |
| Community / inference mining | 10 | 10,000,000 | Usage-weighted over 36 months |
| Investors | 10 | 10,000,000 | 6-month cliff, 36-month vest. **No TGE unlock** |
| Relay inventory bootstrap | 8 | 8,000,000 | Paid only against bonded books, 24 months |
| Liquidity | 8 | 8,000,000 | 50% at listings, 50% over 12 months |

Team and investor unlocks at TGE are rejected. A tape that starts with a 20% insider dump is not a moon tape.

### 5.3 How a dollar of inference becomes a LUG sink

**Pay in USDC**

1. Protocol market-buys LUG with 100% of the spend
2. That LUG locks in the BME vault; `$LIC` mints 1:1 with USD
3. Job runs on an attested node
4. LIC burns at settlement
5. Providers / relays / attesters are reminted LUG (or swap to USDC)
6. **4.2% of job value never remints** (60% of the 7% protocol fee) — permanent burn

If LUG appreciates between top-up and settlement, remint is smaller than the original burn (net deflation). Same identity as Akash AEP-76.

**Pay in LUG**

1. User burns/vaults LUG directly
2. They mint LIC at an **8% discount**
3. The discount is matched by an extra LUG burn, not by printing

Holding reason: paying in LUG is cheaper, and you have to acquire LUG first.

### 5.4 Fee split on every primary job

| Recipient | Share | Notes |
| --- | ---: | --- |
| Attested provider | 82% | +5% if they take LUG instead of cashing out |
| Relay (if used) | 6% | Plus their quoted spread |
| Attesters / validators | 5% | Sampled checks, no prompt retention |
| Protocol | 7% | 60% burn, 40% to veLUG |

### 5.5 Burns (all real; no reflections / rebase)

| Sink | Rate | What it does |
| --- | --- | --- |
| Inference take-rate | 4.2% of every job | Dead burn. Scales linearly with usage |
| Pay-in-LUG extra | 8% on the LUG path | Discount funded by burn, not inflation |
| Sealed-relay fill | 2.5% of secondary volume | The unique sink Darkbloom and Dolphin do not have |
| BME vault float | 100% of prepaid jobs | Locked until settlement; price-up → extra net burn |
| Slash | 50% of slashed bonds | Failed attestation, leak, or relay rug |

Optional 1% conversion fee if a provider insists on instant USDC (buy-and-burn).

### 5.6 Locks that remove float

1. **Provider bond** — scales with 14-day earnings. 90-day cooldown. Boosts job priority.
2. **Relay inventory bond** — 150% of listed book. This is the large vacuum if resale volume exists.
3. **veLUG** — lock 1 week to 4 years. Fee share, model gauges, relay matching priority, provider boost. Unlocked LUG has no fee claim.

### 5.7 Emissions

Reward vault = 38M, quality-weighted (attested throughput that passes checks), not raw uptime.

| Window | Minted | Intent |
| --- | --- | --- |
| Y1 | 15.2M | Bootstrap nodes and relays |
| Y2–Y3 | 11.4M | First decay |
| Y4–Y5 | 6.84M | Second decay |
| Y6–Y8 | 4.56M | Tail, then fee-only |

Quantized or skipped inference (Dolphin’s cheat mode) is slashed, not paid.

### 5.8 Worked monthly example

Assume **$2,000,000** inference, **35%** paid in LUG, **25%** through relays, LUG at **$0.40**.

| Sink | USD | LUG |
| --- | ---: | ---: |
| Take-rate burn (4.2%) | $84,000 | 210,000 |
| LUG-path extra burn (8% × 35%) | $56,000 | 140,000 |
| Relay fill burn (2.5% × 25%) | $12,500 | 31,250 |
| **Permanent burn** | **$152,500** | **381,250** |
| BME vault (outstanding jobs) | $2,000,000 | 5,000,000 |
| Relay bonds (150% × 25%) | $750,000 | 1,875,000 |

Y1 emissions ≈ 1.27M LUG/month. In this example permanent burn is already ~30% of monthly mint, and **~6.9M LUG is locked** on top. At **$20M/month** the burns exceed Y1 mint and the token is net deflationary before decay even hits.

### 5.9 The moon condition (an inequality, not a vibe)

```
permanent_burns(usage) + Δlocks(relays, ve, provider bonds)
    > emissions(t) + insider_unlocks(t) + provider_sells(t)
```

It reprices if private inference demand is real **and** relay books exist. It does not reprice if jobs never show up. Akash’s 2026 BME window showed the mechanism can be real while volume is still too small to bend supply.

**What would actually reprice LUG:** paid private inference, real relay books, slow insider unlocks, providers taking the LUG bonus, visible on-chain burns and bond TVL.

**What would kill it:** shipping as “cheaper OpenRouter” with no attestation; reselling foundation-model keys; uncapped emissions; fake enterprise logos; team dump at TGE.

---

## 6. How users make money

Two honest paths. No reflections.

### Providers

A Mac Studio doing MiniMax-class traffic at $40/day of completions → about **$32.80/day** to the node (82%). Bonding LUG can raise fill rate. Taking LUG settlement adds 5%. Slash only on failed attestation or a leak.

### Relays

Turning **$10k/month** of unused credits at a 6% spread → **$600** plus the 6% protocol relay share. **$250** burns. **$15k** of LUG stays locked against the book.

Illustrative only. Fill depends on demand, model, attestation tier, and bond. Not a return promise.

---

## 7. The website

The old Lugano homepage was an enterprise brochure (fake Palantir / Lockheed / SOC 2 marks). That is gone.

The new site is a **short, Darkbloom-style product preview**: dark navy (`#020c1b`), lake-blue accent (`#0d72c0` → `#3b9edd`), Geist / Geist Mono, sparse copy, two CTAs.

### 7.1 Pages

| Route | File | What it is |
| --- | --- | --- |
| `/` | `client/src/pages/Home.tsx` | Landing. Hero, three roles, privacy layers, pricing, API snippet, models, token teaser |
| `/privacy` | `client/src/pages/Privacy.tsx` | Precise claims + competitive table |
| `/earn` | `client/src/pages/Earn.tsx` | Provide vs relay, what you can sell, worked earnings |
| `/tokenomics` | `client/src/pages/Tokenomics.tsx` | Allocation, dual-asset loop, burns, locks, emissions, **interactive sink calculator** |
| `/docs` | `client/src/pages/Docs.tsx` | OpenAI-compatible API sketch + model catalog |
| 404 | `client/src/pages/NotFound.tsx` | Dark 404 |

Shared chrome (nav + footer): `client/src/components/SiteChrome.tsx`
All numbers live in one place: `client/src/lib/protocol.ts` (site and tests stay in sync)

### 7.2 Homepage sections (top to bottom)

1. **Nav** — Product, Privacy, Earn, Token, Docs · “Start inference”
2. **Hero** — “Private inference anyone can buy. Access anyone can resell.” CTAs to `/docs` and `/earn`
3. **Stats bar** — E2EE · 82% to the node · 2.5% burnt on resale · `$LUG`
4. **Infer / Provide / Relay** — the three doors
5. **Operator-blind** — four privacy layers
6. **Pricing table** — illustrative ~50% under typical API rates (Gemma, Qwen, MiniMax, DeepSeek, Kimi)
7. **API** — `baseURL: "https://api.lugano.ai/v1"`
8. **Models** — Kimi K2.6, DeepSeek V4 Pro, MiniMax M3, GLM-5.1, MiMo V2.5-Pro, DeepSeek V4 Flash
9. **Token flywheel CTA** — “Jobs buy $LUG. Relays lock $LUG. Fills burn $LUG.”
10. **Footer** — protocol design disclaimer

### 7.3 Tokenomics page extras

Sliders for monthly volume, % paid in LUG, % through relays, assumed LUG price. Outputs permanent burn, BME vault lock, relay bonds, and total float touched. Default example: $2M volume, 35% LUG pay, 25% relays, $0.40.

### 7.4 Stack

React 19 + Vite 7 + wouter + Tailwind 4 + Geist. Express serves the built `dist/public` in production. Domain CNAME remains `lugano.ai`.

### 7.5 How to run the site

From the repo:

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && NODE_ENV=production node dist/index.js
```

From this zip (folder `site/`):

```bash
cd site
python3 -m http.server 4173
# open http://localhost:4173
```

Or: `./open-site.sh`

---

## 8. Honest risks

1. **Attestation is the product.** If multi-hardware TEE/SE work is fake, do not ship.
2. **Coordinator honesty.** Do not claim “the router never sees plaintext.”
3. **Provider dump.** Most node operators will sell wages. BME only works if the next buyer shows up.
4. **Relay cold start.** A sealed book with no fills is just locked tokens. Bootstrap must pay *fills*, not listings.
5. **Regulation.** Fee share + burns can look like a security. Keep the public site as protocol design until counsel says otherwise.
6. **ToS / fraud.** First-party resale only.
7. **Latency.** Consumer meshes lose to datacenters on P99. Sell privacy and price, not “faster than Groq.”
8. **Incumbents.** Darkbloom can add a token. Dolphin can add SE-style privacy. The wedge lasts only if sealed relays have liquidity first.

---

## 9. What must be true before a token

1. One hardware class with real attestation and a public verify path
2. OpenAI-compatible sealed client
3. A worker a non-crypto user can install in one command
4. A relay fill that does not leak prompt or identities in logs
5. On-chain burn and bond counters a stranger can audit

Only then does `$LUG` have something to meter.

---

## 10. What’s in the rest of this pack

| Path | Contents |
| --- | --- |
| `LUGANO_SUMMARY.md` | This document |
| `docs/PROJECT_VETTING.md` | Competitive research (Darkbloom, Dolphin, DeAI) |
| `docs/TOKENOMICS.md` | Full economic spec |
| `site/` | Built website (open via `open-site.sh` or a local static server) |
| `open-site.sh` | Starts a local server on port 4173 |

---

## 11. References

- https://www.darkbloom.dev/
- https://github.com/Layr-Labs/d-inference/
- https://dphn.ai/network
- https://deck.dphn.ai/
- https://akash.network/blog/what-burn-mint-equilibrium-means-for-akash/
- https://daniliants.com/insights/darkbloom-private-ai-inference-on-apple-silicon/
