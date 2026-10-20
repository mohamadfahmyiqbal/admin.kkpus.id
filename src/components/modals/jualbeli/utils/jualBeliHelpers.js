// PATH: src/components/modals/jualbeli/utils/jualBeliHelpers.js

export const parseNumber = (val) => {
  if (val == null) return 0;
  if (typeof val === "number") return val;
  const s = String(val).trim();
  const n = Number(s);
  if (!isNaN(n)) return n;
  const r = s.replace(/[^\d]/g, "");
  return Number(r) || 0;
};

export const formatCurrency = (val, formatRp) => {
  if (val == null) return "Rp 0";
  const num = Number(val);
  if (isNaN(num)) return val;
  if (formatRp) {
    try {
      return formatRp(num);
    } catch {}
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export const checkCanApprove = ({
  viewOnly,
  isApproved,
  isRejected,
  isBendaharaStep,
  hasDownPayment,
  hasUploadedDP,
  verifierRole,
  userData,
}) => {
  if (viewOnly) return false;
  if (isApproved || isRejected) return false;
  if (isBendaharaStep && hasDownPayment && !hasUploadedDP) return false;
  if (!verifierRole) return true;
  if (!userData) return true;

  const target = verifierRole.toLowerCase();
  const userRole =
    typeof userData.role === "string" ? userData.role.toLowerCase() : "";
  const userRoles = Array.isArray(userData.roles)
    ? userData.roles.map((r) =>
        typeof r === "string" ? r.toLowerCase() : (r.role_name || "").toLowerCase()
      )
    : [];
  const roleAssignments = Array.isArray(userData.roleAssignments)
    ? userData.roleAssignments.map((e) =>
        (e.role?.role_name || e.role_name || "").toLowerCase()
      )
    : [];
  const fullName =
    typeof userData.full_name === "string" ? userData.full_name.toLowerCase() : "";

  const allRoles = [userRole, ...userRoles, ...roleAssignments, fullName].filter(
    Boolean
  );

  return allRoles.some((r) => r.includes(target) || target.includes(r));
};
