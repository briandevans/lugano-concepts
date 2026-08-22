# $LUG Tokenomics

Status: protocol design. Not an offering, not a return forecast.

Lugano uses two assets:

- **$LUG** — scarce coordination token. Staked, burned, governed.
- **$LIC** — USD-denominated inference credit. Minted only by vaulting/burning LUG. Not a speculative float.

The design goal is simple: **real private-inference volume should bid for LUG, lock LUG, and burn LUG.** Emissions exist only to bootstrap supply and then decay.

## Why most DeAI tokens fail

1. **Emissions pay hardware, hardware dumps.** io.net-style GPU markets mint faster than usage can absorb.
2. **No privacy premium.** If the product is just cheaper H100s, AWS and CoreWeave win on trust and latency.
3. **No second demand surface.** One loop (pay GPU → sell token) is fragile.
4. **Uncapped inflation.** Markets eventually treat the token as wage scrip.

Lugano’s answer: operator-blind inference (Darkbloom’s actual product), idle-hardware supply (Dolphin), burn-mint credits (Akash BME), plus a **sealed access market** that must be overcollateralized in LUG.

## Supply

| | |
| --- | --- |
| Hard cap | 100,000,000 LUG |
| TGE float target | Liquidity 4M + no team unlock + no investor unlock |
| Inflation after year 8 | None. Rewards become fee-funded. |

### Allocation

| Bucket | % | Amount | Unlock |
| --- | ---: | ---: | --- |
| Network rewards | 38 | 38,000,000 | 8-year decaying epochs |
| Team | 14 | 14,000,000 | 12-month cliff, 48-month vest |
| Treasury / grants | 12 | 12,000,000 | DAO, 4-year linear |
| Community / inference mining | 10 | 10,000,000 | Usage-weighted, 36 months |
| Investors | 10 | 10,000,000 | 6-month cliff, 36-month vest |
| Relay inventory bootstrap | 8 | 8,000,000 | Paid only against bonded books, 24 months |
| Liquidity | 8 | 8,000,000 | 50% listing, 50% 12 months |

Team and investor **do not unlock at TGE.** That is load-bearing. A moon tape that starts with a 20% insider dump is not a moon tape.

## Dual-asset loop (BME)

Users price jobs in dollars. The protocol still routes value through LUG.

### Pay in USDC

1. Protocol market-buys LUG with 100% of the spend.
2. That LUG is locked in the BME vault and $LIC is minted 1:1 with USD.
3. Job runs on an attested node.
4. LIC is burned at settlement.
5. Providers / relays / attesters are reminted LUG from the vault (or paid USDC via an instant swap they choose).
6. **4.2% of job value never remints** (60% of the 7% protocol fee). Permanent burn.

If LUG appreciates between top-up and settlement, remint is smaller than the original burn. Net deflation, same identity as [Akash AEP-76](https://akash.network/blog/what-burn-mint-equilibrium-means-for-akash/).

### Pay in LUG

1. User burns/vaults LUG directly.
2. They mint LIC at an **8% discount**.
3. The discount is matched by an extra LUG burn, not by printing.
4. Same settlement remint rules as above.

This is the holding reason: paying in LUG is cheaper, and it requires acquiring LUG first.

### Fee split on every primary job

| Recipient | Share | Notes |
| --- | ---: | --- |
| Attested provider | 82% | 5% bonus if they take LUG instead of cashing out |
| Relay (if used) | 6% | Plus whatever spread they quoted |
| Attesters / validators | 5% | Sampled verification, no prompt retention |
| Protocol | 7% | 60% burn, 40% to veLUG |

## Sealed relays — the second sink

Anyone can resell **first-party** access:

- Unused LIC they bought
- Spare attested node capacity
- veLUG priority windows

They cannot resell third-party API keys. That is fraud and out of scope.

Rules:

- Listings are identity-blind. Buyer, seller, and prompt stay unlinkable at the market layer.
- Relay never decrypts the job. They sell a sealed capability.
- **Bond 150% of listed inventory in LUG.** 90-day cooldown on bond withdrawal after delist.
- **2.5% of every fill is burned.**
- Non-delivery or a privacy leak slashes the bond: 50% burn, 50% to the reporter.

This is the mechanism that can actually vacuum float. $10M of relay books implies $15M of LUG locked, plus burns on turnover. Darkbloom and Dolphin have no equivalent.

## Other burns

- Slash burns (attestation failure, enabled logs, relay rug)
- Optional 1% conversion fee if a provider insists on instant USDC (buy-and-burn)

Theater burns (reflections, rebase, “buyback when we feel like it”) are rejected.

## Locks

1. **Provider bond** — scales with 14-day earnings. Boosts routing. 90-day cooldown. Dolphin-style cryptoeconomic honesty.
2. **Relay inventory bond** — 150% overcollateralization. The moon lock.
3. **veLUG** — 1 week to 4 years. Fee share, gauges (which models get emission boost), relay matching priority, provider boost.

veLUG is not a ponzi rebase. It is vote-escrow. Unlocked LUG has no fee claim.

## Emissions

Reward vault = 38M.

| Window | Minted | Intent |
| --- | --- | --- |
| Y1 | 15.2M | Bootstrap nodes and relays |
| Y2–Y3 | 11.4M | First decay |
| Y4–Y5 | 6.84M | Second decay |
| Y6–Y8 | 4.56M | Tail, then fee-only |

Emissions are **quality-weighted** (attested throughput that passes sampled checks), not raw uptime. Dolphin’s failure mode — quantized or skipped inference — is slashed, not paid.

## Worked monthly example

Assume $2,000,000 inference, 35% paid in LUG, 25% through relays, LUG at $0.40.

| Sink | USD | LUG |
| --- | ---: | ---: |
| Take-rate burn (4.2%) | $84,000 | 210,000 |
| LUG-path extra burn (8% × 35%) | $56,000 | 140,000 |
| Relay fill burn (2.5% × 25%) | $12,500 | 31,250 |
| **Permanent burn** | **$152,500** | **381,250** |
| BME vault (outstanding jobs) | $2,000,000 | 5,000,000 |
| Relay bonds (150% × 25%) | $750,000 | 1,875,000 |

Y1 emissions are ~1.27M LUG/month. In this example permanent burn is already ~30% of monthly mint, and **6.9M LUG is locked** on top. At $20M/month volume the burns exceed Y1 mint and the token is net deflationary before decay even hits.

That is the moon condition: **usage overtakes emissions.** It is not guaranteed. Akash’s 2026 BME window showed the same math with volume still an order of magnitude too small.

## What would actually reprice LUG

1. Private inference that enterprises and agents will pay for (the Darkbloom trust model, multi-hardware).
2. Relays with real books — a second marketplace, not a whitepaper feature.
3. Slow insider unlocks.
4. Providers taking the LUG bonus instead of instant sell.
5. Visible on-chain burns and bond TVL.

## What would kill it

1. Shipping as “cheaper OpenRouter” with no attestation.
2. Reselling OpenAI/Anthropic keys.
3. Uncapped emissions to chase GPU counts.
4. Fake enterprise logos and unverifiable privacy slogans.
5. Team dump at TGE.

Full competitive vetting lives in `docs/PROJECT_VETTING.md`.
