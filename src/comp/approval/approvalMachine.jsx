// approvalMachine.js
import { createMachine } from "xstate";

export const approvalMachine = createMachine({
  id: "approvalFlow",
  initial: "waiting_pengawas",
  states: {
    waiting_pengawas: {
      on: {
        APPROVE_PENGAWAS: "waiting_ketua",
        REJECT: "rejected",
      },
    },
    waiting_ketua: {
      on: {
        APPROVE_KETUA: "waiting_bendahara",
        REJECT: "rejected",
      },
    },
    waiting_bendahara: {
      on: {
        APPROVE_BENDAHARA: "approved",
        REJECT: "rejected",
      },
    },
    approved: {
      type: "final",
    },
    rejected: {
      type: "final",
    },
  },
});
