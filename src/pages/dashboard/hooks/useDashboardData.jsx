// PATH: src/pages/dashboard/hooks/useDashboardData.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Users,
  Wallet,
  ShoppingCart,
  Heart,
  Bank,
  TrendUp,
} from "phosphor-react";
import { toast } from "react-toastify";
import approvalService from "../../../utils/api/UApproval";
import dashboardService from "../../../utils/api/UDashboard";
import { getSocket } from "../../../utils/api/socket";

const initialDashboardState = {
  stats: [
    { title: "Total Anggota", value: "...", icon: "Users", color: "primary" },
    { title: "Total Simpanan", value: "...", icon: "Wallet", color: "success" },
    { title: "Total Jual Beli", value: "...", icon: "ShoppingCart", color: "info" },
    { title: "Total Program", value: "...", icon: "Heart", color: "danger" },
    { title: "Total Tabungan", value: "...", icon: "Bank", color: "warning" },
    { title: "Total Investasi", value: "...", icon: "TrendUp", color: "dark" },
  ],
  pendingCategorized: {
    simpanan: [],
    jualBeli: [],
    program: [],
    tabungan: [],
    investasi: [],
  },
  notifications: [],
};

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(initialDashboardState);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, regRes] = await Promise.all([
        dashboardService.getAdminDashboardData(),
        approvalService.getPendingRegistrations(),
      ]);

      if (dashRes.data?.success) {
        setDashboardData(dashRes.data.data);
      }
      if (regRes.data?.success) {
        setPendingRegistrations(regRes.data.data);
      }
    } catch (err) {
      console.error("Gagal memuat data dashboard admin:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const socket = getSocket();
    if (socket) {
      let lastToastTime = 0;
      const refreshHandler = (payload) => {
        console.log("🔔 [Dashboard] Socket event received:", payload);
        fetchData();

        const now = Date.now();
        if (now - lastToastTime > 1500) {
          lastToastTime = now;
          const title = payload?.title || "Antrian Persetujuan";
          const message = payload?.message || "Terdapat pembaruan data di antrian persetujuan.";
          toast.info(
            <div>
              <div className="fw-bold">{title}</div>
              <div className="small opacity-75">{message}</div>
            </div>,
            { autoClose: 5000 }
          );
        }
      };

      socket.on("APPROVAL_UPDATE", refreshHandler);
      socket.on("notifications:update", refreshHandler);
      socket.on("REGISTRATION_UPDATED", refreshHandler);
      socket.on("TRANSACTION_UPDATED", refreshHandler);

      return () => {
        socket.off("APPROVAL_UPDATE", refreshHandler);
        socket.off("notifications:update", refreshHandler);
        socket.off("REGISTRATION_UPDATED", refreshHandler);
        socket.off("TRANSACTION_UPDATED", refreshHandler);
      };
    }
  }, [fetchData]);

  const statsList = useMemo(() => {
    const iconMap = {
      Users: <Users size={28} />,
      Wallet: <Wallet size={28} />,
      Heart: <Heart size={28} />,
      ShoppingCart: <ShoppingCart size={28} />,
      Bank: <Bank size={28} />,
      TrendUp: <TrendUp size={28} />,
    };
    return (dashboardData.stats || []).map((s) => ({
      ...s,
      icon: iconMap[s.icon] || s.icon || <Wallet size={28} />,
    }));
  }, [dashboardData.stats]);

  const categorizedData = useMemo(() => {
    const manualFromSimpanan = (dashboardData.pendingCategorized?.simpanan || [])
      .filter((s) => s.is_manual_payment);
    const manualFromRegistration = (dashboardData.pendingCategorized?.registration || [])
      .filter((s) => s.is_manual_payment);

    const allManualRegMap = new Map();
    [...manualFromRegistration, ...manualFromSimpanan].forEach((item) => {
      if (!allManualRegMap.has(item.id)) {
        allManualRegMap.set(item.id, {
          ...item,
          full_name: item.name || item.full_name,
          status_name: item.item || "Verifikasi Setoran Pokok/Wajib",
          amount: item.amount,
          date: item.date,
          registration_id: item.id,
        });
      }
    });
    const registrationPayments = Array.from(allManualRegMap.values());

    return {
      registration: [
        ...(pendingRegistrations || []).map((r) => ({
          ...r,
          full_name: r.type === "TERMINATION" ? r.member?.full_name : (r.full_name || r.name),
          status_name: r.type === "TERMINATION" ? "Pengajuan Berhenti" : (r.memberTypeDetail?.status_name || r.member_type),
          date: r.registered_at || r.submitted_at || "-",
        })),
        ...registrationPayments,
      ],
      simpanan: dashboardData.pendingCategorized?.simpanan || [],
      jualBeli: dashboardData.pendingCategorized?.jualBeli || [],
      program: dashboardData.pendingCategorized?.program || [],
      tabungan: dashboardData.pendingCategorized?.tabungan || [],
      investasi: dashboardData.pendingCategorized?.investasi || [],
    };
  }, [pendingRegistrations, dashboardData.pendingCategorized]);

  const totalPending = useMemo(() => {
    return Object.values(categorizedData).reduce(
      (acc, arr) => acc + (arr ? arr.length : 0),
      0
    );
  }, [categorizedData]);

  return {
    loading,
    statsList,
    categorizedData,
    totalPending,
    notifications: dashboardData.notifications || [],
    fetchData,
  };
};

export default useDashboardData;
