export const PROTOCOL = {
  name: "Lugano",
  domain: "lugano.ai",
  token: "LUG",
  credit: "LIC",
  chain: "Solana + Ethereum settlement (design)",
  status: "Protocol design / research preview",
} as const;

export const SUPPLY = {
  total: 100_000_000,
  symbol: "LUG",
} as const;

export const ALLOCATION = [
  {
    key: "rewards",
    label: "Network rewards",
    pct: 38,
    amount: 38_000_000,
    unlock: "8-year decaying epochs. Providers, relays, attesters.",
    color: "#3b9edd",
  },
  {
    key: "team",
    label: "Team",
    pct: 14,
    amount: 14_000_000,
    unlock: "12-month cliff, 48-month vest. No TGE unlock.",
    color: "#7dd3fc",
  },
  {
    key: "treasury",
    label: "Treasury / grants",
    pct: 12,
    amount: 12_000_000,
    unlock: "DAO-gated, 4-year linear. Security + model grants.",
    color: "#38bdf8",
  },
  {
    key: "community",
    label: "Community & inference mining",
    pct: 10,
    amount: 10_000_000,
    unlock: "Usage-weighted over 36 months. No airdrop mercenaries.",
    color: "#818cf8",
  },
  {
    key: "investors",
    label: "Investors",
    pct: 10,
    amount: 10_000_000,
    unlock: "6-month cliff, 36-month vest.",
    color: "#a78bfa",
  },
  {
    key: "relays",
    label: "Relay inventory bootstrap",
    pct: 8,
    amount: 8_000_000,
    unlock: "Only paid against bonded sealed-credit books. 24 months.",
    color: "#22d3ee",
  },
  {
    key: "liquidity",
    label: "Liquidity",
    pct: 8,
    amount: 8_000_000,
    unlock: "50% at listings, 50% over 12 months.",
    color: "#0d72c0",
  },
] as const;

export const FEE_SPLIT = {
  provider: 82,
  relay: 6,
  attesters: 5,
  protocol: 7,
} as const;

export const BURNS = [
  {
    name: "Inference take-rate",
    rate: "4.2% of every job",
    detail:
      "60% of the 7% protocol fee is permanently burned. Never reminted. Scales linearly with usage.",
  },
  {
    name: "Pay-in-LUG bonus burn",
    rate: "8% extra sink",
    detail:
      "Users who settle in LUG mint LIC at an 8% discount. The discount is funded by a matching LUG burn, not inflation.",
  },
  {
    name: "Sealed-relay fill",
    rate: "2.5% of secondary volume",
    detail:
      "Every private resale of access burns 2.5% of fill value. This is the unique sink Darkbloom and Dolphin do not have.",
  },
  {
    name: "BME vault float",
    rate: "100% of prepaid jobs",
    detail:
      "USDC or LUG spent on inference is converted to LUG and locked in the BME vault until settlement. If LUG appreciates mid-job, remint is smaller than burn — net deflation.",
  },
  {
    name: "Slash burn",
    rate: "50% of slashed bonds",
    detail:
      "Failed attestation, leaked plaintext, or relay non-delivery: 50% of the bond is burned, 50% paid to the reporter.",
  },
] as const;

export const LOCKS = [
  {
    name: "Provider bond",
    rule: "Bond scales with 14-day earnings. 90-day cooldown.",
    effect: "Boosts job priority. Makes cheating economically irrational.",
  },
  {
    name: "Relay inventory bond",
    rule: "150% overcollateralization of listed sealed credits.",
    effect: "The more access is resold, the more LUG is removed from float.",
  },
  {
    name: "veLUG",
    rule: "Lock 1 week to 4 years. Linear boost.",
    effect: "Fee share, gauge votes, relay matching priority, provider boost.",
  },
] as const;

export const EMISSIONS = [
  { year: "Y1", minted: "15.2M", note: "40% of reward vault. Bootstrap supply." },
  { year: "Y2–Y3", minted: "11.4M", note: "First halving of the remaining vault." },
  { year: "Y4–Y5", minted: "6.84M", note: "Second decay step." },
  { year: "Y6–Y8", minted: "4.56M", note: "Tail emissions. Then fee-only rewards." },
] as const;

export const ROLES = [
  {
    id: "infer",
    kicker: "01  /  Consume",
    title: "Private inference",
    body: "Swap your OpenAI base URL. Prompts are encrypted before they leave your app and only decrypt inside an attested runtime. Pay in USDC or LUG.",
    cta: "Read the API",
    href: "/docs",
  },
  {
    id: "provide",
    kicker: "02  /  Supply",
    title: "Sell idle compute",
    body: "Run a Lugano worker on a Mac, a Linux GPU box, or a TEE host. You get paid for completed, attested jobs. Bond LUG for priority routing.",
    cta: "Start earning",
    href: "/earn",
  },
  {
    id: "relay",
    kicker: "03  /  Resell",
    title: "Private access relays",
    body: "Resell your unused credits or node capacity without revealing who bought it or what they ran. Bond LUG against inventory. Earn the spread.",
    cta: "Relay design",
    href: "/earn#relay",
  },
] as const;

export const PRIVACY_LAYERS = [
  {
    tag: "Layer 01",
    title: "Client-sealed requests",
    body: "The SDK encrypts the prompt to the selected provider's attested key before the request hits the coordinator. Routing sees ciphertext, model id, and a token budget — not the text.",
  },
  {
    tag: "Layer 02",
    title: "Hardware-bound keys",
    body: "Decryption keys are born inside Apple Secure Enclave, NVIDIA CC, or Intel/AMD TEE. The attestation chain is public and roots in the vendor CA. A home operator cannot export the key.",
  },
  {
    tag: "Layer 03",
    title: "Hardened runtime",
    body: "Debugger attach, memory inspection, and host logging are blocked. Node software cannot enable prompt logs. Failed posture checks drop the node from the mesh.",
  },
  {
    tag: "Layer 04",
    title: "Signed receipts",
    body: "Every response is signed by the machine that produced it. Buyers, relays, and auditors can verify hardware without seeing the prompt.",
  },
] as const;

export const PRECISE_CLAIMS = [
  {
    claim: "The Mac / GPU owner cannot read your prompt.",
    status: "Design target",
    note: "True only if attestation, sealed keys, and the hardened runtime all hold. This is Darkbloom's actual product. We adopt it and extend it beyond Apple Silicon.",
  },
  {
    claim: "The coordinator never sees plaintext.",
    status: "Not the claim",
    note: "Like Darkbloom, a coordinator CVM may briefly see plaintext while re-sealing to a provider. It is never logged or retained. Do not market this as 'the router is blind'.",
  },
  {
    claim: "Relays cannot read jobs they resell.",
    status: "Design target",
    note: "A relay sells a sealed capability, not a decrypted session. Settlement reveals model, tokens, and price only.",
  },
  {
    claim: "You can resell OpenAI or Anthropic keys.",
    status: "Forbidden",
    note: "Protocol settles only Lugano-attested compute and first-party LIC. Third-party key resale is ToS fraud and is out of scope.",
  },
] as const;

export const COMPARABLES = [
  {
    name: "Darkbloom",
    token: "None",
    privacy: "Operator-blind on attested Macs",
    compute: "Idle Apple Silicon",
    gap: "Best privacy story. Mac-only. No token, no secondary access market.",
  },
  {
    name: "Dolphin ($POD)",
    token: "POD",
    privacy: "E2EE + no logs + bonds",
    compute: "Idle consumer GPUs",
    gap: "Real DePIN loop. Encrypted binaries ≠ operator-blind. No private resale.",
  },
  {
    name: "Phala / TEE clouds",
    token: "PHA",
    privacy: "Hardware enclaves",
    compute: "Datacenter TEE",
    gap: "Strong attestations. Not a permissionless idle-hardware mesh.",
  },
  {
    name: "io.net / Akash",
    token: "IO / AKT",
    privacy: "Weak / none",
    compute: "GPU marketplaces",
    gap: "Compute is rented in the clear. AKT BME is the burn pattern we adapt.",
  },
  {
    name: "Bittensor",
    token: "TAO",
    privacy: "None",
    compute: "Intelligence markets",
    gap: "Incentivizes model output, not private inference sessions.",
  },
  {
    name: "Lugano",
    token: "LUG",
    privacy: "Operator-blind + sealed relays",
    compute: "Mac + GPU + TEE",
    gap: "The missing product: private inference anyone can buy, and private access anyone can resell.",
  },
] as const;

export const PRICING = [
  { model: "Gemma 4 12B", in: 0.02, out: 0.12, ref: 0.24, note: "On-device dense" },
  { model: "Qwen3.6-27B", in: 0.08, out: 0.62, ref: 1.20, note: "Apache dense" },
  { model: "MiniMax M2.7", in: 0.05, out: 0.40, ref: 0.80, note: "Agent teams" },
  { model: "DeepSeek V4 Flash", in: 0.10, out: 0.70, ref: 1.40, note: "1M context" },
  { model: "Kimi K2.6", in: 0.14, out: 1.05, ref: 2.10, note: "Best all-round" },
] as const;

export const MODELS = [
  {
    name: "Kimi K2.6",
    org: "Moonshot AI",
    logo: "K",
    rank: 1,
    params: "1T MoE",
    context: "262K ctx",
    badge: "Best All-Round",
    highlight: true,
    color: "#3b9edd",
    bestFor: "Best all-round model",
  },
  {
    name: "DeepSeek V4 Pro",
    org: "DeepSeek",
    logo: "DS",
    rank: 2,
    params: "1.6T / 49B",
    context: "1M ctx",
    badge: "Best Instruction",
    highlight: false,
    color: "#38bdf8",
    bestFor: "Best instruction following + API cost",
  },
  {
    name: "MiniMax M3",
    org: "MiniMax",
    logo: "MM",
    rank: 3,
    params: "MSA",
    context: "1M ctx",
    badge: "Best OS Coding",
    highlight: false,
    color: "#818cf8",
    bestFor: "Best OS coding agent",
  },
  {
    name: "GLM-5.1",
    org: "Z.AI",
    logo: "Z",
    rank: 4,
    params: "Flagship",
    context: "200K ctx",
    badge: "Long Horizon",
    highlight: false,
    color: "#06b6d4",
    bestFor: "Great at long-horizon tasks",
  },
  {
    name: "MiMo V2.5-Pro",
    org: "Xiaomi MiMo",
    logo: "Mi",
    rank: 5,
    params: "MIT weights",
    context: "1M ctx",
    badge: "Best Harness",
    highlight: false,
    color: "#34d399",
    bestFor: "Best harness integration",
  },
  {
    name: "DeepSeek V4 Flash",
    org: "DeepSeek",
    logo: "DS",
    rank: 6,
    params: "284B / 13B",
    context: "1M ctx",
    badge: "Long + Fast",
    highlight: false,
    color: "#60a5fa",
    bestFor: "Great at long analysis + speed",
  },
] as const;

export function formatTokens(n: number) {
  return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
}

export function estimateMonth(args: {
  volumeUsd: number;
  lugPayShare: number;
  relayShare: number;
  lugPrice: number;
}) {
  const { volumeUsd, lugPayShare, relayShare, lugPrice } = args;
  const takeRateBurnUsd = volumeUsd * 0.042;
  const lugPathUsd = volumeUsd * lugPayShare;
  const lugDiscountBurnUsd = lugPathUsd * 0.08;
  const relayVolumeUsd = volumeUsd * relayShare;
  const relayBurnUsd = relayVolumeUsd * 0.025;
  const permanentBurnUsd = takeRateBurnUsd + lugDiscountBurnUsd + relayBurnUsd;
  const vaultLockUsd = volumeUsd;
  const relayBondUsd = relayVolumeUsd * 1.5;
  const price = Math.max(lugPrice, 0.0001);

  return {
    takeRateBurnUsd,
    lugDiscountBurnUsd,
    relayBurnUsd,
    permanentBurnUsd,
    permanentBurnLug: permanentBurnUsd / price,
    vaultLockLug: vaultLockUsd / price,
    relayBondLug: relayBondUsd / price,
    floatRemovedLug: (permanentBurnUsd + vaultLockUsd + relayBondUsd) / price,
  };
}
