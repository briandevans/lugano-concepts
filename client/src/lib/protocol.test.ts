import { describe, expect, it } from "vitest";
import { ALLOCATION, SUPPLY, estimateMonth } from "./protocol";

describe("token allocation", () => {
  it("sums to the hard cap", () => {
    const total = ALLOCATION.reduce((sum, row) => sum + row.amount, 0);
    expect(total).toBe(SUPPLY.total);
    const pct = ALLOCATION.reduce((sum, row) => sum + row.pct, 0);
    expect(pct).toBe(100);
  });
});

describe("estimateMonth", () => {
  it("burns scale with volume, LUG pay share, and relay volume", () => {
    const low = estimateMonth({ volumeUsd: 1_000_000, lugPayShare: 0, relayShare: 0, lugPrice: 1 });
    const high = estimateMonth({ volumeUsd: 1_000_000, lugPayShare: 0.5, relayShare: 0.4, lugPrice: 1 });

    expect(low.takeRateBurnUsd).toBeCloseTo(42_000);
    expect(low.lugDiscountBurnUsd).toBe(0);
    expect(low.relayBurnUsd).toBe(0);
    expect(high.permanentBurnUsd).toBeGreaterThan(low.permanentBurnUsd);
    expect(high.relayBondLug).toBeCloseTo(600_000);
    expect(high.vaultLockLug).toBe(1_000_000);
  });
});
