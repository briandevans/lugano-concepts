# Lugano project vetting

Research snapshot: August 2026. This is a design review, not diligence on a live network.

## The ask

Build a private-inference product in the same category as **Dolphin** and **Darkbloom**, with a DeAI compute token, a path for anyone to buy private inference, and a path for anyone to **resell access / compute privately**. Tokenomics should have real burns and real user revenue — a structure that *can* reprice if usage appears — without collapsing into a reflection scam.

## Category map

Private / decentralized inference is not one market. The control points differ.

| Project | Control point | Privacy | Token | Hardware |
| --- | --- | --- | --- | --- |
| [Darkbloom](https://www.darkbloom.dev/) (Eigen / Layr Labs) | Operator-blind inference on idle Macs | Best in class: client seal, Secure Enclave keys, hardened runtime, signed receipts | None | Apple Silicon only |
| [Dolphin Network](https://dphn.ai/network) | Idle GPU inference + $POD | E2EE, no logs, encrypted/signed binaries, bonds, sampled logprob checks | $POD | Consumer / datacenter GPUs |
| Phala, Super Protocol, TEE clouds | Hardware enclave inference | Strong attestations, centralized-ish inventory | PHA / others | Intel TDX, NVIDIA CC |
| io.net, Akash, Nosana, Spheron | Raw GPU rental | Generally none | IO, AKT, NOS | Datacenter + independent GPUs |
| Bittensor | Intelligence markets, not sessions | None | TAO + subnet alpha | Specialized miners |
| Gensyn | Verifiable training | N/A for inference privacy | $AI | Untrusted training hosts |
| Nillion | Blind computation / secret data | Different stack (MPC / custom) | NIL | Not a GPU mesh |

### Darkbloom — what to copy

Darkbloom’s paper and site are unusually honest. The hard sentence is: **the provider has root and physical custody, and still must not see plaintext.** Four layers enforce that. The coordinator is *not* claimed to be fully blind; plaintext may exist briefly in a confidential VM, is not logged, and is re-sealed to the provider. Pricing is concrete (~50% under OpenRouter-class APIs). Distribution is a one-line install. Operators earn most of the fee.

Gaps: Mac-only. No token. No way to resell unused access. Eigen can keep this as a product, not a network economy.

### Dolphin — what to copy

Dolphin is the closest DePIN loop: gamers and idle GPUs join a **peer-to-pool** (leave anytime, unlike Akash/io.net reservations), earn $POD, optionally **bond** for a reward boost and slash risk. Verification is the weak/strong mix typical of decentralized inference: checksums, signed binaries, hardware metrics, sampled logprobs, user reports.

Gaps: encrypted binaries and obfuscation are not operator-blind. A determined host with a debugger is a different threat model than Apple’s Secure Enclave. No secondary private access market. $POD demand is mostly “earn and sell” unless inference buyers are forced through the token.

### What nobody ships

**A sealed secondary market for attested inference access.**

That is Lugano’s wedge:

1. Anyone can buy private inference (Darkbloom UX).
2. Anyone can sell idle compute (Dolphin UX, multi-hardware).
3. Anyone can resell *their* credits or capacity without revealing buyer, seller, or prompt.
4. $LUG is the bond, the burn, and the settlement asset.

If (3) is omitted, this is a reskin. If (3) includes third-party API keys, this is a crime. The only legal object of resale is Lugano-attested compute and first-party $LIC.

## Product thesis

**Name:** Lugano (existing brand and domain `lugano.ai`).

**One-liner:** Private inference anyone can buy. Access anyone can resell.

**Users**

- Developers and agents who will not send source, medical, legal, or trading context to a hosted API.
- Hardware owners (Mac Studios, 4090s, small TEE boxes) whose GPUs sit idle most hours.
- Relays: people or desks that warehouse LIC and node hours and sell sealed capabilities.

**Non-users**

- Anyone who needs a 99.99% regional SLA tomorrow (they stay on Azure/Bedrock).
- Anyone who wants uncensored models with no attestation (they run llama.cpp locally).
- Anyone who wants to arbitrage OpenAI keys.

## Architecture (design)

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

Verification mix (do not pick only one):

- Hardware attestation (Darkbloom-grade) as the privacy root.
- Sampled output checks + bonds (Dolphin-grade) as the quality root.
- Peer-to-pool scheduling so consumer GPUs can come and go.

## Token thesis

See `docs/TOKENOMICS.md` for numbers.

Moon condition, stated as an inequality:

```
permanent_burns(usage) + Δlocks(relays, ve, provider bonds)
    > emissions(t) + insider_unlocks(t) + provider_sells(t)
```

Mechanisms that make the left side grow with usage:

- USDC jobs still market-buy LUG (BME).
- 4.2% of every job is a dead burn.
- Pay-in-LUG is cheaper, so holders have a reason besides hope.
- Relays lock 150% inventory and burn 2.5% per fill.
- veLUG takes fee share only if locked.

This is closer to **AKT BME + GMX-style collateral + ve-escrow** than to a meme burn. It can fail the same way Akash’s 2026 BME window failed to bend supply: the mechanism was real, the volume was not.

## Honest risks

1. **Attestation is the product.** If multi-hardware TEE/SE work is fake, privacy claims become marketing and the project should not exist.
2. **Coordinator honesty.** Darkbloom-precise language is mandatory. “The router never sees plaintext” is likely false.
3. **Provider dump.** Even with a LUG bonus, most node operators will sell wages. BME only works if the next buyer shows up.
4. **Relay cold start.** A sealed book with no fills is just locked tokens and angry LPs. Bootstrap emissions must pay *fills*, not listings.
5. **Regulation.** A token with fee share and burns can be treated as a security in some venues. Keep the public site as protocol design until counsel says otherwise.
6. **ToS / fraud.** Resale is first-party only. Never position this as a darknet for foundation-model keys.
7. **Latency / quality.** Consumer meshes lose to datacenters on P99. Sell privacy and price, not “faster than Groq.”
8. **Incumbents.** Darkbloom can add a token. Dolphin can add SE-style privacy. The wedge is only durable if sealed relays have liquidity first.

## What we stripped from the old site

The previous Lugano homepage claimed Palantir, Lockheed, BlackRock, SOC 2, FedRAMP, and “100+ enterprise clients.” None of that is evidenced in this repo. Shipping fake trust marks is how a privacy network dies before mainnet. The new site is a **research preview / protocol design** with illustrative pricing.

## Success criteria (pre-token)

1. One hardware class with real attestation and a public verify path.
2. OpenAI-compatible sealed client.
3. A worker a non-crypto user can install in one command.
4. A relay book that can complete a sealed fill without leaking prompt or identities in logs.
5. On-chain burn and bond counters a stranger can audit.

Only then does $LUG have something to meter.

## References

- https://www.darkbloom.dev/
- https://github.com/Layr-Labs/d-inference/
- https://dphn.ai/network
- https://deck.dphn.ai/
- https://akash.network/blog/what-burn-mint-equilibrium-means-for-akash/
- https://daniliants.com/insights/darkbloom-private-ai-inference-on-apple-silicon/
