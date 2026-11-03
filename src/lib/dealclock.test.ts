import { describe, expect, it } from "vitest";
import { addBiz, addDays, defaultDeal, HOLIDAYS, plan, type Deal } from "./dealclock";

// The reference contract used in the report's story: offer accepted Mon Nov 2, 2026,
// package submitted Wed Nov 4 after the 4 p.m. ET cutoff, closing Wed Dec 2.
const deal = (o: Partial<Deal> = {}): Deal => ({ ...defaultDeal("2026-11-03"), ...o });
const milestone = (d: Deal, id: string) => plan(d).milestones.find((m) => m.id === id)!.date;
const alertIds = (d: Deal) => plan(d).alerts.map((a) => a.id);
const weekday = (iso: string) => new Date(iso + "T00:00:00Z").getUTCDay();

describe("business days", () => {
  it("skips weekends", () => {
    expect(addBiz("2026-11-06", 1)).toBe("2026-11-09"); // Fri → Mon
  });

  it("skips federal holidays", () => {
    expect(addBiz("2026-11-10", 1)).toBe("2026-11-12"); // Veterans Day, Wed Nov 11
    expect(addBiz("2026-11-25", 1)).toBe("2026-11-27"); // Thanksgiving, Thu Nov 26
  });
});

describe("day 0 (Folder Received)", () => {
  it("is the submission day when sent before the 4 p.m. ET cutoff", () => {
    expect(plan(deal({ afterCutoff: false })).day0).toBe("2026-11-04");
  });

  it("moves to the next business day when sent after the cutoff", () => {
    expect(plan(deal({ afterCutoff: true })).day0).toBe("2026-11-05");
  });

  it("moves a weekend submission to Monday", () => {
    expect(plan(deal({ submission: "2026-11-07", afterCutoff: false })).day0).toBe("2026-11-09");
  });
});

describe("Purchase Priority milestones", () => {
  it("orders the appraisal within one business day of day 0", () => {
    expect(milestone(deal(), "appr_order")).toBe("2026-11-06");
  });

  it("puts the day-9 gate on business day 9, skipping Veterans Day", () => {
    expect(milestone(deal(), "day9")).toBe("2026-11-19");
  });

  it("puts clear to close on business day 12", () => {
    expect(plan(deal()).ctc).toBe("2026-11-24");
  });

  it("delays clear to close when a slow appraisal misses the day-9 gate", () => {
    const fast = plan(deal()).ctc;
    const slow = plan(deal({ appraisalTurnBizDays: 10 })).ctc;
    expect(slow > fast).toBe(true);
    expect(alertIds(deal({ appraisalTurnBizDays: 10 }))).toContain("day9_appraisal");
  });
});

describe("TRID Closing Disclosure timing", () => {
  it("waits 3 business days (Saturdays count, Thanksgiving doesn't) and closes on the next weekday", () => {
    // CD received Tue Nov 24 → Wed 25, Fri 27, Sat 28 → earliest practical closing Mon Nov 30
    expect(plan(deal()).earliestClose).toBe("2026-11-30");
  });

  it("adds 3 business days when the Closing Disclosure is mailed", () => {
    const emailed = plan(deal()).earliestClose;
    const mailed = plan(deal({ cdByMail: true })).earliestClose;
    expect(mailed > emailed).toBe(true);
    expect(alertIds(deal({ cdByMail: true }))).toContain("cd_mail");
  });

  it("never proposes a closing on a weekend or federal holiday", () => {
    for (let i = 0; i < 60; i++) {
      const submission = addDays("2026-10-06", i);
      const p = plan(deal({ acceptance: addDays(submission, -2), submission, lockDate: submission, closing: addDays(submission, 40) }));
      expect([0, 6]).not.toContain(weekday(p.earliestClose));
      expect(HOLIDAYS[p.earliestClose]).toBeUndefined();
    }
  });
});

describe("collisions with the purchase contract", () => {
  it("flags an appraisal contingency that ends before the appraisal is reviewed", () => {
    expect(alertIds(deal())).toContain("appraisal_cont");
  });

  it("flags a financing contingency that ends before clear to close", () => {
    expect(alertIds(deal())).toContain("financing_cont");
  });

  it("flags a contract closing date earlier than the earliest practical closing", () => {
    const d = deal({ closing: "2026-11-25" });
    expect(plan(d).slackDays).toBeLessThan(0);
    expect(alertIds(d)).toContain("close_late");
  });

  it("flags a rate lock that expires before closing", () => {
    expect(alertIds(deal({ closing: "2026-12-10" }))).toContain("lock_expiry");
    expect(alertIds(deal({ closing: "2026-12-10", lockTermDays: 45 }))).not.toContain("lock_expiry");
  });

  it("is on track once the contract dates leave room for the loan", () => {
    const d = deal({ afterCutoff: false, appraisalContingencyDays: 21, financingContingencyDays: 25 });
    expect(plan(d).verdict).toBe("on_track");
  });
});

describe("program eligibility", () => {
  it("plans FHA and VA loans on the standard timeline", () => {
    const p = plan(deal({ program: "fha" }));
    expect(p.eligible).toBe(false);
    expect(p.ctc > plan(deal()).ctc).toBe(true);
  });

  it("requires a complete package and an Orbit partner", () => {
    expect(plan(deal({ fullPackage: false })).eligible).toBe(false);
    expect(plan(deal({ orbitPartner: false })).eligible).toBe(false);
  });

  it("stops applying the program after its Dec 14, 2026 window", () => {
    const p = plan(deal({ acceptance: "2026-12-13", submission: "2026-12-15", lockDate: "2026-12-15", closing: "2027-01-20" }));
    expect(p.eligible).toBe(false);
  });
});
