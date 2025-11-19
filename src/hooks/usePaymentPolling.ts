import { useState, useEffect, useRef, useCallback } from "react";
// @ts-ignore
import { getInvoiceStatus } from "@/services/payment.service";

interface UsePaymentPollingOptions {
  invoiceId: string | number | null;
  enabled: boolean;
  onSuccess?: (invoice: any) => void;
  onError?: (error: Error) => void;
  pollInterval?: number; // milliseconds
  maxPollingTime?: number; // milliseconds
}

export function usePaymentPolling({
  invoiceId,
  enabled,
  onSuccess,
  onError,
  pollInterval = 2000, // 2 seconds
  maxPollingTime = 300000, // 5 minutes
}: UsePaymentPollingOptions) {
  const [isPolling, setIsPolling] = useState(false);
  const [invoiceStatus, setInvoiceStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);
  const shouldPollRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, []);

  const checkInvoiceStatus = useCallback(async () => {
    if (!invoiceId || !enabled || !isMountedRef.current) return;

    try {
      const timestamp = new Date().toISOString();
      const invoice = await getInvoiceStatus(invoiceId);

      if (!isMountedRef.current) return;

      if (invoice) {
        setInvoiceStatus(invoice.trang_thai);
        setError(null);
        console.log(
          "[PaymentPolling] Poll result",
          JSON.stringify({
            timestamp,
            invoiceId,
            status: invoice.trang_thai,
          })
        );

        // Nếu hóa đơn đã thanh toán
        if (invoice.trang_thai === "da_thanh_toan") {
          setIsPolling(false);
          stopPolling();
          if (onSuccess) {
            onSuccess(invoice);
          }
          return;
        }

        // Kiểm tra thời gian polling
        const now = Date.now();
        const startedAt = startTimeRef.current;
        if (startedAt && now - startedAt > maxPollingTime) {
          console.warn(
            "[PaymentPolling] Max polling time reached",
            JSON.stringify({
              timestamp: new Date().toISOString(),
              invoiceId,
              duration: now - startedAt,
            })
          );
          setIsPolling(false);
          stopPolling();
          setError("Đã hết thời gian chờ thanh toán");
          return;
        }

        // Tiếp tục polling nếu chưa thanh toán
        if (shouldPollRef.current && isMountedRef.current) {
          pollingRef.current = setTimeout(() => {
            checkInvoiceStatus();
          }, pollInterval);
          console.log(
            "[PaymentPolling] Scheduled next check",
            JSON.stringify({
              timestamp: new Date().toISOString(),
              invoiceId,
              pollInterval,
            })
          );
        }
      }
    } catch (err: any) {
      if (!isMountedRef.current) return;

      console.error(
        "[PaymentPolling] Error checking invoice status",
        JSON.stringify({
          invoiceId,
          message: err?.message,
          timestamp: new Date().toISOString(),
        }),
        err
      );
      setError(err.message || "Lỗi khi kiểm tra trạng thái thanh toán");
      if (onError) {
        onError(err);
      }
      // Tiếp tục polling ngay cả khi có lỗi (có thể là lỗi tạm thời)
      if (shouldPollRef.current && isMountedRef.current) {
        pollingRef.current = setTimeout(() => {
          checkInvoiceStatus();
        }, pollInterval);
        console.log(
          "[PaymentPolling] Retry scheduled after error",
          JSON.stringify({
            timestamp: new Date().toISOString(),
            invoiceId,
            pollInterval,
          })
        );
      }
    }
  }, [
    invoiceId,
    enabled,
    isPolling,
    pollInterval,
    maxPollingTime,
    onSuccess,
    onError,
  ]);

  const startPolling = useCallback(() => {
    if (!invoiceId || !enabled) return;

    setIsPolling(true);
    shouldPollRef.current = true;
    setError(null);
    startTimeRef.current = Date.now();
    console.log(
      "[PaymentPolling] Start polling",
      JSON.stringify({
        timestamp: new Date().toISOString(),
        invoiceId,
        enabled,
      })
    );
    checkInvoiceStatus();
  }, [invoiceId, enabled, checkInvoiceStatus]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
    shouldPollRef.current = false;
    console.log(
      "[PaymentPolling] Stop polling",
      JSON.stringify({
        timestamp: new Date().toISOString(),
        invoiceId,
      })
    );
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
    startTimeRef.current = null;
  }, []);

  // Tự động bắt đầu polling khi enabled = true
  useEffect(() => {
    if (enabled && invoiceId && !isPolling) {
      startPolling();
    } else if (!enabled && isPolling) {
      stopPolling();
    }
  }, [enabled, invoiceId, isPolling, startPolling, stopPolling]);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    isPolling,
    invoiceStatus,
    error,
    startPolling,
    stopPolling,
  };
}
