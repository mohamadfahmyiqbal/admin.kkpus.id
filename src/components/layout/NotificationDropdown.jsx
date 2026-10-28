import React, { memo, useState, useEffect, useRef, useCallback } from "react";
import {
  Bell,
  Check,
  Checks,
  Clock,
  ArrowClockwise,
  Info,
  WarningCircle,
  CheckCircle,
} from "phosphor-react";
import UNotification from "../../utils/api/UNotification";
import { getSocket } from "../../utils/api/socket";
import "./NotificationDropdown.css";

const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return "Baru saja";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m yang lalu`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}j yang lalu`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 7) return `${diffDay}h yang lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

export const NotificationDropdown = memo(({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await UNotification.getNotifications({ limit: 10, offset: 0 });
      if (res.data?.list) {
        setNotifications(res.data.list);
        const unread = res.data.list.filter((n) => n.status === 1).length;
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

    return () => {
      socket.off("notifications:new", handleNewNotif);
      socket.off("notifications:update", handleNewNotif);
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
    e.stopPropagation();
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
    const unreadIds = notifications.filter((n) => n.status === 1).map((n) => n.id);
    if (unreadIds.length === 0) return;

    try {
      await UNotification.markAsRead(unreadIds);
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 2 })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Gagal tandai semua dibaca:", err);
    }
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button
        type="button"
        className="btn btn-topbar-action btn-link text-white position-relative shadow-none rounded-circle d-flex align-items-center justify-content-center border-0"
        style={{ width: "38px", height: "38px", minWidth: "38px", minHeight: "38px", padding: 0 }}
        onClick={toggleDropdown}
        title="Notifikasi"
        aria-label="Buka Notifikasi"
        aria-expanded={isOpen}
      >
        <Bell size={20} weight="bold" />
        {unreadCount > 0 && (
          <span
            className="position-absolute bg-danger border border-white rounded-circle d-flex align-items-center justify-content-center text-white"
            style={{
              top: "2px",
              right: "2px",
              minWidth: "16px",
              height: "16px",
              fontSize: "0.65rem",
              fontWeight: 700,
              padding: "0 4px",
              lineHeight: 1,
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notif-dropdown-menu" role="menu">
          <div className="notif-dropdown-header">
            <div className="d-flex align-items-center gap-2">
              <span className="fw-bold text-dark small">Notifikasi</span>
              {unreadCount > 0 && (
                <span className="badge bg-primary rounded-pill extra-small">
                  {unreadCount} Baru
                </span>
              )}
            </div>
            <div className="d-flex align-items-center gap-1">
              <button
                type="button"
                className="btn btn-sm btn-link text-muted p-1 lh-1"
                onClick={fetchNotifications}
                title="Refresh Notifikasi"
                disabled={loading}
              >
                <ArrowClockwise size={14} className={loading ? "spin" : ""} />
              </button>
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="btn btn-sm btn-link text-primary p-0 extra-small fw-semibold text-decoration-none ms-1"
                  onClick={handleMarkAllAsRead}
                >
                  Tandai semua dibaca
                </button>
              )}
            </div>
          </div>

          <div className="notif-dropdown-body">
            {loading && notifications.length === 0 ? (
              <div className="text-center py-4 text-muted small">
                <div className="spinner-border spinner-border-sm text-primary mb-2" role="status" />
                <div>Memuat notifikasi...</div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-4 px-3 text-muted">
                <CheckCircle size={32} className="text-muted opacity-50 mb-2" />
                <div className="small fw-semibold text-dark">Tidak ada notifikasi</div>
                <div className="extra-small text-muted">Semua update atau pesan baru akan muncul di sini.</div>
              </div>
            ) : (
              notifications.map((item) => {
                const isUnread = item.status === 1;
                return (
                  <div
                    key={item.id}
                    className={`notif-item ${isUnread ? "is-unread" : ""}`}
                    onClick={(e) => handleMarkAsRead(item, e)}
                  >
                    {isUnread && <div className="notif-item-indicator" />}
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div className="notif-item-title">{item.title}</div>
                      {isUnread && (
                        <button
                          type="button"
                          className="btn btn-sm btn-link p-0 text-muted extra-small"
                          title="Tandai dibaca"
                          onClick={(e) => handleMarkAsRead(item, e)}
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                    <div className="notif-item-body">{item.body}</div>
                    <div className="notif-item-time">
                      <Clock size={12} />
                      <span>{formatRelativeTime(item.sent_at)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notif-dropdown-footer">
              <span className="extra-small text-muted">
                Menampilkan {notifications.length} notifikasi terbaru
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default NotificationDropdown;
