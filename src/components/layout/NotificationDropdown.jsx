import React, { memo, useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  Checks,
  Clock,
  ArrowClockwise,
  CheckCircle,
  ShieldCheck,
  User,
  FileText,
  ArrowRight,
  Tray,
} from "phosphor-react";
import UNotification from "../../utils/api/UNotification";
import { getSocket } from "../../utils/api/socket";
import { jwtEncode } from "../../utils/helpers";
import "./NotificationDropdown.css";

const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 45) return "Baru saja";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m lalu`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}j lalu`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) return `${diffDay}h lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return "";
  }
};

const getCategoryMeta = (item) => {
  const text = `${item.title || ""} ${item.body || ""}`.toLowerCase();

  if (
    text.includes("persetujuan") ||
    text.includes("tugas baru") ||
    text.includes("verifikasi") ||
    text.includes("menunggu")
  ) {
    let target = "dashboard";
    if (text.includes("pendaftaran") || text.includes("anggota") || text.includes("calon")) {
      target = "membersPage";
    } else if (text.includes("pinjam") || text.includes("pembiayaan")) {
      target = "pinjamanList";
    } else if (text.includes("tabung")) {
      target = "tabunganList";
    } else if (text.includes("arisan")) {
      target = "arisanBatchPage";
    } else if (text.includes("simpan") || text.includes("tarik")) {
      target = "simpananDashboard";
    }

    return {
      type: "approval",
      label: "Tugas Pengawas",
      badgeClass: "bg-warning bg-opacity-10 text-warning-emphasis border border-warning border-opacity-25",
      iconBg: "#fef3c7",
      iconColor: "#b45309",
      Icon: ShieldCheck,
      targetPage: target,
    };
  }

  if (text.includes("pendaftaran") || text.includes("anggota")) {
    return {
      type: "member",
      label: "Keanggotaan",
      badgeClass: "bg-info bg-opacity-10 text-info border border-info border-opacity-25",
      iconBg: "#f0fdfa",
      iconColor: "#0f766e",
      Icon: User,
      targetPage: "membersPage",
    };
  }

  if (
    text.includes("pembiayaan") ||
    text.includes("pinjaman") ||
    text.includes("bayar") ||
    text.includes("tagihan")
  ) {
    return {
      type: "finance",
      label: "Pembiayaan",
      badgeClass: "bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25",
      iconBg: "#eff6ff",
      iconColor: "#1d4ed8",
      Icon: FileText,
      targetPage: "pinjamanList",
    };
  }

  if (text.includes("disetujui") || text.includes("selesai") || text.includes("berhasil")) {
    return {
      type: "success",
      label: "Selesai",
      badgeClass: "bg-success bg-opacity-10 text-success border border-success border-opacity-25",
      iconBg: "#f0fdf4",
      iconColor: "#15803d",
      Icon: CheckCircle,
      targetPage: "dashboard",
    };
  }

  return {
    type: "general",
    label: "Info",
    badgeClass: "bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25",
    iconBg: "#f8fafc",
    iconColor: "#475569",
    Icon: Bell,
    targetPage: "dashboard",
  };
};

export const NotificationDropdown = memo(({ user }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'unread' | 'approval'
  const dropdownRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await UNotification.getNotifications({ limit: 15, offset: 0 });
      if (res.data?.list) {
        setNotifications(res.data.list);
        const unread =
          typeof res.data?.unread_count === "number"
            ? res.data.unread_count
            : res.data.list.filter((n) => n.status === 1).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Gagal memuat notifikasi:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch initial notifications
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listen to socket events for real-time notifications
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewNotif = () => {
      fetchNotifications();
    };

    socket.on("notifications:new", handleNewNotif);
    socket.on("notifications:update", handleNewNotif);
    socket.on("APPROVAL_UPDATE", handleNewNotif);
    socket.on("REGISTRATION_UPDATED", handleNewNotif);
    socket.on("TRANSACTION_UPDATED", handleNewNotif);

    return () => {
      socket.off("notifications:new", handleNewNotif);
      socket.off("notifications:update", handleNewNotif);
      socket.off("APPROVAL_UPDATE", handleNewNotif);
      socket.off("REGISTRATION_UPDATED", handleNewNotif);
      socket.off("TRANSACTION_UPDATED", handleNewNotif);
    };
  }, [fetchNotifications]);

  // Close dropdown on click outside or escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        fetchNotifications();
      }
      return next;
    });
  }, [fetchNotifications]);

  const handleMarkAsRead = async (item, e) => {
    if (e) e.stopPropagation();
    if (item.status === 2) return; // Already read

    try {
      await UNotification.markAsRead(item.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, status: 2 } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Gagal tandai dibaca:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await UNotification.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 2 })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Gagal tandai semua dibaca:", err);
    }
  };

  const handleItemClick = useCallback(
    async (item) => {
      const meta = getCategoryMeta(item);
      if (item.status === 1) {
        try {
          await UNotification.markAsRead(item.id);
          setNotifications((prev) =>
            prev.map((n) => (n.id === item.id ? { ...n, status: 2 } : n))
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
          console.error("Gagal tandai dibaca:", err);
        }
      }
      setIsOpen(false);
      if (meta.targetPage) {
        navigate(`/${jwtEncode({ page: meta.targetPage })}`);
      }
    },
    [navigate]
  );

  const handleGoToDashboard = useCallback(() => {
    setIsOpen(false);
    navigate(`/${jwtEncode({ page: "dashboard" })}`);
  }, [navigate]);

  const isPengawas = useMemo(() => {
    const roles = user?.roles;
    if (Array.isArray(roles)) {
      return roles.some((r) => String(r).toLowerCase().includes("pengawas"));
    }
    return String(roles || "").toLowerCase().includes("pengawas");
  }, [user]);

  const filteredNotifications = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter((n) => n.status === 1);
    }
    if (activeTab === "approval") {
      return notifications.filter((n) => {
        const text = `${n.title || ""} ${n.body || ""}`.toLowerCase();
        return (
          text.includes("persetujuan") ||
          text.includes("tugas baru") ||
          text.includes("verifikasi") ||
          text.includes("menunggu") ||
          text.includes("pengajuan")
        );
      });
    }
    return notifications;
  }, [notifications, activeTab]);

  const approvalCount = useMemo(() => {
    return notifications.filter((n) => {
      const text = `${n.title || ""} ${n.body || ""}`.toLowerCase();
      return (
        n.status === 1 &&
        (text.includes("persetujuan") ||
          text.includes("tugas baru") ||
          text.includes("verifikasi") ||
          text.includes("menunggu") ||
          text.includes("pengajuan"))
      );
    }).length;
  }, [notifications]);

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        type="button"
        className={`btn btn-topbar-action btn-link text-white position-relative shadow-none rounded-circle d-flex align-items-center justify-content-center border-0 ${
          isOpen ? "bg-white bg-opacity-25" : ""
        }`}
        style={{
          width: "38px",
          height: "38px",
          minWidth: "38px",
          minHeight: "38px",
          padding: 0,
          color: "#ffffff",
          transition: "background-color 0.15s ease",
        }}
        onClick={toggleDropdown}
        title={isPengawas ? "Notifikasi & Tugas Pengawas" : "Notifikasi"}
        aria-label="Buka Notifikasi"
        aria-expanded={isOpen}
      >
        <Bell
          size={20}
          weight={unreadCount > 0 ? "fill" : "bold"}
          color="#ffffff"
          style={{ color: "#ffffff", display: "block" }}
        />
        {unreadCount > 0 && (
          <span
            className="position-absolute"
            style={{
              top: "2px",
              right: "2px",
              minWidth: "18px",
              height: "18px",
              backgroundColor: "#ef4444",
              border: "2px solid #ffffff",
              borderRadius: "999px",
              color: "#ffffff",
              fontSize: "0.625rem",
              fontWeight: 800,
              padding: "0 4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              boxShadow: "0 2px 6px rgba(239, 68, 68, 0.4)",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notif-dropdown-menu" role="menu">
          {/* Header */}
          <div className="notif-dropdown-header">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <div className="d-flex align-items-center gap-2">
                <span className="notif-header-title">
                  {isPengawas ? "Notifikasi Pengawas" : "Notifikasi"}
                </span>
                {isPengawas && (
                  <span className="notif-role-badge">Pengawas</span>
                )}
                {unreadCount > 0 && (
                  <span className="badge bg-danger rounded-pill extra-small px-2 py-0.5">
                    {unreadCount} Baru
                  </span>
                )}
              </div>
              <div className="d-flex align-items-center gap-1">
                <button
                  type="button"
                  className="notif-refresh-btn"
                  onClick={fetchNotifications}
                  title="Refresh Notifikasi"
                  disabled={loading}
                >
                  <ArrowClockwise size={14} className={loading ? "spin" : ""} weight="bold" />
                </button>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between pt-1">
              <span className="extra-small text-muted">
                {unreadCount > 0
                  ? `Ada ${unreadCount} notifikasi yang belum dibaca`
                  : "Semua notifikasi telah dibaca"}
              </span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="notif-btn-markall"
                  onClick={handleMarkAllAsRead}
                  title="Tandai semua notifikasi sudah dibaca"
                >
                  <Checks size={14} weight="bold" />
                  <span>Tandai semua dibaca</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="notif-dropdown-tabs">
            <button
              type="button"
              className={`notif-tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              Semua
              <span className="notif-tab-count">{notifications.length}</span>
            </button>
            <button
              type="button"
              className={`notif-tab-btn ${activeTab === "unread" ? "active" : ""}`}
              onClick={() => setActiveTab("unread")}
            >
              Belum Dibaca
              {unreadCount > 0 && (
                <span className="notif-tab-count unread">{unreadCount}</span>
              )}
            </button>
            <button
              type="button"
              className={`notif-tab-btn ${activeTab === "approval" ? "active" : ""}`}
              onClick={() => setActiveTab("approval")}
            >
              Persetujuan
              {approvalCount > 0 && (
                <span className="notif-tab-count warning">{approvalCount}</span>
              )}
            </button>
          </div>

          {/* Body */}
          <div className="notif-dropdown-body">
            {loading && notifications.length === 0 ? (
              <div className="text-center py-5 text-muted small">
                <div className="spinner-border spinner-border-sm text-primary mb-2" role="status" />
                <div>Memuat notifikasi...</div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-5 px-4 text-muted">
                <Tray size={36} className="text-muted opacity-50 mb-2" weight="light" />
                <div className="small fw-semibold text-dark mb-1">
                  {activeTab === "unread"
                    ? "Tidak ada notifikasi baru"
                    : activeTab === "approval"
                    ? "Tidak ada tugas persetujuan pending"
                    : "Belum ada notifikasi"}
                </div>
                <div className="extra-small text-muted">
                  {activeTab === "unread"
                    ? "Semua notifikasi masuk sudah Anda baca."
                    : activeTab === "approval"
                    ? "Antrian tugas persetujuan saat ini sedang kosong."
                    : "Pemberitahuan terkait pengajuan dan aktivitas akan muncul di sini."}
                </div>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const isUnread = item.status === 1;
                const meta = getCategoryMeta(item);
                const IconComponent = meta.Icon;

                return (
                  <div
                    key={item.id}
                    className={`notif-item ${isUnread ? "is-unread" : ""}`}
                    onClick={() => handleItemClick(item)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="d-flex gap-2.5 align-items-start">
                      <div
                        className="notif-icon-bubble"
                        style={{
                          backgroundColor: meta.iconBg,
                          color: meta.iconColor,
                        }}
                      >
                        <IconComponent size={18} weight="bold" />
                      </div>

                      <div className="flex-grow-1 min-w-0">
                        <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                          <div className="d-flex align-items-center gap-1.5 flex-wrap">
                            <span className={`badge rounded-pill extra-small px-2 py-0.5 fw-semibold ${meta.badgeClass}`}>
                              {meta.label}
                            </span>
                            {isUnread && (
                              <span className="notif-unread-dot" title="Belum dibaca" />
                            )}
                          </div>
                          <span className="notif-item-time">
                            <Clock size={11} />
                            {formatRelativeTime(item.sent_at)}
                          </span>
                        </div>

                        <div className="notif-item-title">{item.title}</div>
                        <div className="notif-item-body">{item.body}</div>

                        <div className="d-flex align-items-center justify-content-between mt-2 pt-1 border-top border-light-subtle">
                          <span className="notif-action-link">
                            Lihat Detail <ArrowRight size={11} weight="bold" />
                          </span>
                          {isUnread && (
                            <button
                              type="button"
                              className="notif-btn-mark"
                              title="Tandai sudah dibaca"
                              onClick={(e) => handleMarkAsRead(item, e)}
                            >
                              <Check size={12} weight="bold" />
                              <span>Tandai dibaca</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="notif-dropdown-footer">
            <button
              type="button"
              className="btn btn-sm btn-light w-100 fw-semibold text-primary d-flex align-items-center justify-content-center gap-1.5 py-1.5 rounded-pill border shadow-none"
              onClick={handleGoToDashboard}
            >
              <ShieldCheck size={16} weight="bold" />
              <span className="small">Buka Antrian Persetujuan</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default NotificationDropdown;
